<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        // Include home and away team relationships AND referee
        return Game::with(['homeTeam', 'awayTeam', 'league', 'referee'])->get();
    }

    public function show($id) {
        return Game::with(['league', 'homeTeam', 'awayTeam', 'referee'])->findOrFail($id);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'league_id' => 'nullable|exists:leagues,id',
            'home_team_id' => 'required|exists:teams,id',
            'away_team_id' => 'required|exists:teams,id',
            'match_date' => 'required|date',
            'home_score' => 'nullable|integer',
            'away_score' => 'nullable|integer',
            'status' => 'nullable|string',
            'referee_id' => 'nullable|exists:referees,id' // Add this line
        ]);
        $game = Game::create($validated);
        return response()->json($game, 201);
    }

    public function update(Request $request, $id) {
        $game = Game::findOrFail($id);
        $game->update($request->all());
        return response()->json($game, 200);
    }

    public function destroy($id) {
        Game::destroy($id);
        return response()->json(null, 204);
    }
}