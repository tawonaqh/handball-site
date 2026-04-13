<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Services\StandingsService;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function __construct(private StandingsService $standings) {}

    public function index()
    {
        return Game::with(['homeTeam', 'awayTeam', 'league', 'referee'])->get();
    }

    public function show($id)
    {
        return Game::with(['league', 'homeTeam.players', 'awayTeam.players', 'referee'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'league_id'    => 'nullable|exists:leagues,id',
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'match_date'   => 'required|date',
            'home_score'   => 'nullable|integer',
            'away_score'   => 'nullable|integer',
            'status'       => 'nullable|string',
            'referee_id'   => 'nullable|exists:referees,id',
            'round'        => 'nullable|integer',
            'venue'        => 'nullable|string',
            'bracket_slot' => 'nullable|string',
            'group_label'  => 'nullable|string',
            'leg'          => 'nullable|integer',
        ]);
        return response()->json(Game::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $game->update($request->all());

        // If scores changed on a completed game, recalculate standings
        if ($game->league_id && $game->status === 'completed' &&
            ($request->has('home_score') || $request->has('away_score'))) {
            $this->standings->recalculate($game->league_id);
        }

        return response()->json($game);
    }

    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $leagueId = $game->league_id;
        $game->delete();

        if ($leagueId) {
            $this->standings->recalculate($leagueId);
        }

        return response()->json(null, 204);
    }
}