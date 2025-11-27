<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        // Load league, tournament, and ranking relationships
        return Team::with(['league.tournament', 'ranking'])->get();
    }

    public function show($id)
    {
        // Load players, league, and ranking for a single team
        return Team::with(['players', 'league', 'ranking'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $team = Team::create($request->all());
        return response()->json($team, 201);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $team->update($request->all());
        return response()->json($team, 200);
    }

    public function destroy($id)
    {
        Team::destroy($id);
        return response()->json(null, 204);
    }
}
