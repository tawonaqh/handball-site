<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\League;
use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Ranking;
use App\Services\BracketService;
use App\Services\StandingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LiveMatchController extends Controller
{
    public function __construct(
        private StandingsService $standings,
        private BracketService   $bracket
    ) {}

    // ─── Public: Get live match state ────────────────────────────────────────

    public function getLiveMatch($id)
    {
        try {
            $game = Game::with(['homeTeam.players', 'awayTeam.players', 'league'])->findOrFail($id);

            if (!$game->live_data) {
                return response()->json([
                    'gameId'      => $game->id,
                    'time'        => 0,
                    'isRunning'   => false,
                    'teamAName'   => $game->homeTeam->name,
                    'teamBName'   => $game->awayTeam->name,
                    'scoreA'      => $game->home_score ?? 0,
                    'scoreB'      => $game->away_score ?? 0,
                    'playersA'    => [],
                    'playersB'    => [],
                    'onCourtA'    => [],
                    'onCourtB'    => [],
                    'activeFouls' => [],
                    'matchLog'    => [],
                    'timestamp'   => now()->toIso8601String(),
                ]);
            }

            return response()->json($game->live_data);
        } catch (\Exception $e) {
            Log::error('getLiveMatch: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch live match data'], 500);
        }
    }

    // ─── Public: Get match init data with real players ───────────────────────

    public function getMatchInitData($id)
    {
        try {
            $game = Game::with(['homeTeam.players', 'awayTeam.players', 'league'])->findOrFail($id);

            if ($game->live_data) {
                return response()->json($game->live_data);
            }

            $mapPlayer = fn($player, $index) => [
                'id'           => $player->id,
                'name'         => $player->name,
                'number'       => $player->jersey_number ?? ($index + 1),
                'goals'        => 0,
                'assists'      => 0,
                'saves'        => 0,
                'suspensions'  => 0,
                'yellowCard'   => false,
                'blueCard'     => false,
                'isRedCarded'  => false,
            ];

            $playersA  = $game->homeTeam->players->values()->map($mapPlayer)->toArray();
            $playersB  = $game->awayTeam->players->values()->map($mapPlayer)->toArray();
            $onCourtA  = array_slice(array_column($playersA, 'id'), 0, min(7, count($playersA)));
            $onCourtB  = array_slice(array_column($playersB, 'id'), 0, min(7, count($playersB)));

            return response()->json([
                'gameId'      => $game->id,
                'time'        => 0,
                'isRunning'   => false,
                'teamAName'   => $game->homeTeam->name,
                'teamBName'   => $game->awayTeam->name,
                'playersA'    => $playersA,
                'playersB'    => $playersB,
                'onCourtA'    => $onCourtA,
                'onCourtB'    => $onCourtB,
                'activeFouls' => [],
                'matchLog'    => [],
                'timestamp'   => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            Log::error('getMatchInitData: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch match data'], 500);
        }
    }

    // ─── Admin: Update live match state ──────────────────────────────────────

    public function updateLiveMatch(Request $request, $id)
    {
        try {
            $game = Game::findOrFail($id);

            $liveData              = $request->all();
            $liveData['timestamp'] = now()->toIso8601String();

            $game->live_data  = $liveData;
            $game->status     = 'live';
            $game->home_score = $liveData['scoreA'] ?? 0;
            $game->away_score = $liveData['scoreB'] ?? 0;
            $game->save();

            return response()->json(['success' => true, 'timestamp' => now()->toIso8601String()]);
        } catch (\Exception $e) {
            Log::error('updateLiveMatch: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Failed to update match state'], 500);
        }
    }

    // ─── Admin: Finalize match ────────────────────────────────────────────────

    public function finalizeMatch(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $game = Game::with(['homeTeam', 'awayTeam', 'league'])->findOrFail($id);
            $data = $request->all();

            // 1. Update game record
            $game->status       = 'completed';
            $game->home_score   = $data['homeScore'];
            $game->away_score   = $data['awayScore'];
            $game->duration     = $data['duration'] ?? 0;
            $game->completed_at = now();
            $game->save();

            $currentYear        = date('Y');
            $playerStatsUpdated = 0;

            // 2. Update player stats (home + away)
            foreach ([
                ['players' => $data['playersA'] ?? [], 'team_id' => $game->home_team_id],
                ['players' => $data['playersB'] ?? [], 'team_id' => $game->away_team_id],
            ] as $side) {
                foreach ($side['players'] as $pd) {
                    $playerId = (int) ($pd['playerId'] ?? 0);
                    if (!$playerId) continue;
                    $player = Player::query()->find($playerId);
                    if (!$player) continue;

                    $player->goals          += $pd['goals']   ?? 0;
                    $player->assists        += $pd['assists']  ?? 0;
                    $player->matches_played += 1;
                    $player->save();

                    $stats = PlayerStat::firstOrCreate(
                        ['player_id' => $player->id, 'league_id' => $game->league_id, 'season_year' => $currentYear],
                        ['team_id' => $side['team_id'], 'games_played' => 0, 'total_goals' => 0,
                         'total_assists' => 0, 'total_saves' => 0, 'save_rate' => 0,
                         'total_suspensions' => 0, 'red_cards' => 0, 'yellow_cards' => 0, 'blue_cards' => 0]
                    );

                    $stats->games_played       += 1;
                    $stats->total_goals        += $pd['goals']        ?? 0;
                    $stats->total_assists      += $pd['assists']       ?? 0;
                    $stats->total_saves        += $pd['saves']         ?? 0;
                    $stats->total_suspensions  += $pd['suspensions']   ?? 0;
                    if ($pd['redCard']    ?? false) $stats->red_cards    += 1;
                    if ($pd['yellowCard'] ?? false) $stats->yellow_cards += 1;
                    if ($pd['blueCard']   ?? false) $stats->blue_cards   += 1;

                    // Recalculate save rate
                    $totalShots = $stats->total_saves + ($pd['goalsConceded'] ?? 0);
                    $stats->save_rate = $totalShots > 0
                        ? round(($stats->total_saves / $totalShots) * 100, 2)
                        : 0;

                    $stats->save();
                    $playerStatsUpdated++;
                }
            }

            // 3. Recalculate standings from scratch (fixes draw + any prior edits)
            $league       = $game->league;
            $winPts       = $league->win_points  ?? 2;
            $drawPts      = $league->draw_points ?? 1;
            $lossPts      = $league->loss_points ?? 0;
            $pointsAwarded = $this->standings->applyGameToRankings($game, $winPts, $drawPts, $lossPts);

            // 4. Advance bracket winner if knockout game
            $this->bracket->advanceWinner($game);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Match finalized successfully',
                'updates' => [
                    'gameStatus'           => 'completed',
                    'playerStatsUpdated'   => $playerStatsUpdated,
                    'teamStandingsUpdated' => 2,
                    'pointsAwarded'        => $pointsAwarded,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('finalizeMatch: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['success' => false, 'error' => 'Failed to finalize match: ' . $e->getMessage()], 500);
        }
    }

    // ─── Admin: Edit scoreline and recalculate ────────────────────────────────

    public function editScore(Request $request, $id)
    {
        $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $game             = Game::with('league')->findOrFail($id);
            $game->home_score = $request->home_score;
            $game->away_score = $request->away_score;
            $game->status     = 'completed';
            $game->save();

            // Full recalculate triggers the "Recalculate" event
            $this->standings->recalculate($game->league_id);

            DB::commit();

            return response()->json([
                'success'  => true,
                'message'  => 'Score updated and standings recalculated',
                'game'     => $game,
                'standings'=> $this->standings->getStandings($game->league_id),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('editScore: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update score'], 500);
        }
    }

    // ─── Admin: Manual score entry (with or without player stats) ────────────

    public function manualEntry(Request $request, $id)
    {
        $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
            'playersA'   => 'nullable|array',
            'playersB'   => 'nullable|array',
        ]);

        // Reuse finalize logic
        return $this->finalizeMatch($request->merge([
            'homeScore' => $request->home_score,
            'awayScore' => $request->away_score,
        ]), $id);
    }

    // ─── Public: League standings ─────────────────────────────────────────────

    public function getLeagueStandings($leagueId)
    {
        try {
            return response()->json($this->standings->getStandings((int) $leagueId));
        } catch (\Exception $e) {
            Log::error('getLeagueStandings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch standings'], 500);
        }
    }

    // ─── Public: Wildcard virtual table ──────────────────────────────────────

    public function getWildcardTable(Request $request, $leagueId)
    {
        try {
            $topN = (int) $request->get('top', 4);
            return response()->json($this->standings->getWildcardTable((int) $leagueId, $topN));
        } catch (\Exception $e) {
            Log::error('getWildcardTable: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch wildcard table'], 500);
        }
    }

    // ─── Public: Player rankings ──────────────────────────────────────────────

    public function getPlayerRankings(Request $request)
    {
        try {
            $seasonYear = $request->get('season', date('Y'));
            $category   = $request->get('category', 'top_scorer');
            $leagueId   = $request->get('league_id');

            $query = PlayerStat::with(['player', 'team'])
                ->where('season_year', $seasonYear);

            if ($leagueId) {
                $query->where('league_id', $leagueId);
            }

            $orderMap = [
                'top_scorer'    => ['total_goals',   'goals'],
                'top_assist'    => ['total_assists',  'assists'],
                'top_keeper'    => ['total_saves',    'saves'],
                'disciplinary'  => ['red_cards',      'redCards'],
            ];

            [$orderCol, $responseKey] = $orderMap[$category] ?? $orderMap['top_scorer'];

            $stats = $query->orderBy($orderCol, 'desc')
                ->orderBy('games_played', 'asc')
                ->limit(20)
                ->get();

            return response()->json($stats->map(function ($stat, $index) use ($orderCol) {
                return [
                    'rank'        => $index + 1,
                    'player'      => ['id' => $stat->player->id, 'name' => $stat->player->name],
                    'team'        => ['id' => $stat->team->id,   'name' => $stat->team->name],
                    'goals'       => $stat->total_goals,
                    'assists'     => $stat->total_assists,
                    'saves'       => $stat->total_saves,
                    'saveRate'    => $stat->save_rate,
                    'suspensions' => $stat->total_suspensions,
                    'redCards'    => $stat->red_cards,
                    'yellowCards' => $stat->yellow_cards,
                    'blueCards'   => $stat->blue_cards,
                    'gamesPlayed' => $stat->games_played,
                    'average'     => $stat->games_played > 0
                        ? round($stat->$orderCol / $stat->games_played, 2)
                        : 0,
                ];
            }));
        } catch (\Exception $e) {
            Log::error('getPlayerRankings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch rankings'], 500);
        }
    }

    // ─── Public: Match sheet (post-game report) ───────────────────────────────

    public function getMatchSheet($id)
    {
        try {
            $game = Game::with([
                'homeTeam.players',
                'awayTeam.players',
                'league',
                'referee',
            ])->findOrFail($id);

            $currentYear = date('Y');

            $buildPlayerSheet = function ($teamId, $leagueId) use ($currentYear) {
                return PlayerStat::with('player')
                    ->where('team_id', $teamId)
                    ->where('league_id', $leagueId)
                    ->where('season_year', $currentYear)
                    ->get()
                    ->map(fn($s) => [
                        'name'         => $s->player->name,
                        'jersey'       => $s->player->jersey_number,
                        'goals'        => $s->total_goals,
                        'assists'      => $s->total_assists,
                        'saves'        => $s->total_saves,
                        'saveRate'     => $s->save_rate,
                        'suspensions'  => $s->total_suspensions,
                        'yellowCards'  => $s->yellow_cards,
                        'blueCards'    => $s->blue_cards,
                        'redCards'     => $s->red_cards,
                    ]);
            };

            return response()->json([
                'matchId'      => $game->id,
                'date'         => $game->match_date,
                'venue'        => $game->venue,
                'league'       => $game->league?->name,
                'referee'      => $game->referee?->name,
                'homeTeam'     => [
                    'name'    => $game->homeTeam->name,
                    'score'   => $game->home_score,
                    'players' => $buildPlayerSheet($game->home_team_id, $game->league_id),
                ],
                'awayTeam'     => [
                    'name'    => $game->awayTeam->name,
                    'score'   => $game->away_score,
                    'players' => $buildPlayerSheet($game->away_team_id, $game->league_id),
                ],
                'result'       => $this->getResultLabel($game->home_score, $game->away_score),
                'generatedAt'  => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            Log::error('getMatchSheet: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate match sheet'], 500);
        }
    }

    private function getResultLabel(?int $home, ?int $away): string
    {
        if ($home === null || $away === null) return 'N/A';
        if ($home > $away)  return 'Home Win';
        if ($away > $home)  return 'Away Win';
        return 'Draw';
    }
}
