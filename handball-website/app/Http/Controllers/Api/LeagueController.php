<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\League;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index() {
        // Eager load teams
        $leagues = League::with(['teams', 'tournament'])->get();
        return response()->json($leagues);
    }

    public function show($id)
    {
        $league = League::with(['teams.ranking', 'tournament'])->findOrFail($id);

        return response()->json($league);
    }

    public function store(Request $request)
    {
        $league = League::create($request->all());
        return response()->json($league, 201);
    }

    public function update(Request $request, $id)
    {
        $league = League::findOrFail($id);
        $league->update($request->all());
        return response()->json($league, 200);
    }

    public function destroy($id)
    {
        League::destroy($id);
        return response()->json(null, 204);
    }
}