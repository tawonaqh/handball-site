<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ranking;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    public function index() {
        return Ranking::with(['team', 'league'])->get();
    }

    public function show($id) {
        return Ranking::with(['team', 'league'])->findOrFail($id);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'team_id' => 'required|exists:teams,id',
            'played' => 'integer',
            'wins' => 'integer',
            'draws' => 'integer',
            'losses' => 'integer',
            'goals_for' => 'integer',
            'goals_against' => 'integer',
            'points' => 'integer',
        ]);
        $ranking = Ranking::create($validated);
        return response()->json($ranking, 201);
    }

    public function update(Request $request, $id) {
        $ranking = Ranking::findOrFail($id);
        $ranking->update($request->all());
        return response()->json($ranking, 200);
    }

    public function destroy($id) {
        Ranking::destroy($id);
        return response()->json(null, 204);
    }
}
