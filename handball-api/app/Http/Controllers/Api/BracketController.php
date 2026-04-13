<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\League;
use App\Services\BracketService;
use App\Services\StandingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BracketController extends Controller
{
    public function __construct(
        private BracketService   $bracket,
        private StandingsService $standings
    ) {}

    /**
     * Generate round-robin fixtures for a league.
     * POST /leagues/{id}/generate-fixtures
     */
    public function generateFixtures(Request $request, $leagueId)
    {
        $request->validate([
            'team_ids'   => 'required|array|min:2',
            'team_ids.*' => 'exists:teams,id',
            'start_date' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            $league = League::findOrFail($leagueId);
            $games  = $this->bracket->generateRoundRobin(
                $league,
                $request->team_ids,
                $request->start_date
            );

            $created = collect($games)->map(fn($g) => Game::create($g));

            DB::commit();

            return response()->json([
                'success'       => true,
                'fixture_type'  => $league->fixture_type,
                'games_created' => $created->count(),
                'games'         => $created,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate knockout bracket for a league.
     * POST /leagues/{id}/generate-bracket
     */
    public function generateBracket(Request $request, $leagueId)
    {
        $request->validate([
            'team_ids'   => 'required|array|min:2',
            'team_ids.*' => 'nullable|integer',
            'start_date' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            $league = League::findOrFail($leagueId);
            $games  = $this->bracket->generateKnockoutBracket(
                $league,
                $request->team_ids,
                $request->start_date
            );

            DB::commit();

            return response()->json([
                'success'       => true,
                'games_created' => count($games),
                'games'         => $games,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get full bracket tree for a league.
     * GET /leagues/{id}/bracket
     */
    public function getBracket($leagueId)
    {
        $games = Game::with(['homeTeam', 'awayTeam'])
            ->where('league_id', $leagueId)
            ->whereNotNull('bracket_slot')
            ->orderBy('round')
            ->get()
            ->groupBy('round');

        return response()->json([
            'leagueId' => (int) $leagueId,
            'rounds'   => $games->map(fn($roundGames, $round) => [
                'round'  => $round,
                'games'  => $roundGames->map(fn($g) => [
                    'id'          => $g->id,
                    'slot'        => $g->bracket_slot,
                    'homeTeam'    => $g->homeTeam ? ['id' => $g->homeTeam->id, 'name' => $g->homeTeam->name] : null,
                    'awayTeam'    => $g->awayTeam ? ['id' => $g->awayTeam->id, 'name' => $g->awayTeam->name] : null,
                    'homeScore'   => $g->home_score,
                    'awayScore'   => $g->away_score,
                    'status'      => $g->status,
                    'nextMatchId' => $g->next_match_id,
                    'matchDate'   => $g->match_date,
                ]),
            ])->values(),
        ]);
    }

    /**
     * Slot wildcard qualifiers into QF bracket.
     * POST /leagues/{id}/slot-wildcards
     */
    public function slotWildcards(Request $request, $leagueId)
    {
        $request->validate([
            'wildcard_team_ids'  => 'required|array',
            'group_winner_ids'   => 'required|array',
        ]);

        try {
            $league = League::findOrFail($leagueId);
            $this->bracket->slotWildcards(
                $league,
                $request->wildcard_team_ids,
                $request->group_winner_ids
            );

            return response()->json(['success' => true, 'message' => 'Wildcards slotted into bracket']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Recalculate all standings for a league.
     * POST /leagues/{id}/recalculate
     */
    public function recalculate($leagueId)
    {
        try {
            $this->standings->recalculate((int) $leagueId);
            return response()->json([
                'success'   => true,
                'standings' => $this->standings->getStandings((int) $leagueId),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
