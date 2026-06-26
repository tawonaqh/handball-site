<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\Team;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index() {
        // Eager load teams via pivot
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
        $request->validate([
            'gender' => 'nullable|in:men,women',
        ]);
        $league = League::create($request->all());
        return response()->json($league, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'gender' => 'nullable|in:men,women',
        ]);
        $league = League::findOrFail($id);
        $league->update($request->all());
        return response()->json($league, 200);
    }

    public function destroy($id)
    {
        League::destroy($id);
        return response()->json(null, 204);
    }

    // --- Team Enrollment ---

    public function getTeams($id)
    {
        $league = League::with('teams')->findOrFail($id);
        return response()->json($league->teams);
    }

    public function addTeam(Request $request, $id)
    {
        $request->validate(['team_id' => 'required|exists:teams,id']);

        $league = League::findOrFail($id);

        // Avoid duplicates
        if ($league->teams()->where('team_id', $request->team_id)->exists()) {
            return response()->json(['message' => 'Team already in this league'], 409);
        }

        $league->teams()->attach($request->team_id, [
            'group_label' => $request->group_label ?? null,
        ]);

        return response()->json(['message' => 'Team added to league'], 201);
    }

    public function removeTeam($id, $teamId)
    {
        $league = League::findOrFail($id);
        $league->teams()->detach($teamId);
        return response()->json(['message' => 'Team removed from league'], 200);
    }

    public function updateTeam(Request $request, $id, $teamId)
    {
        $request->validate([
            'group_label' => 'nullable|string|max:10',
        ]);

        $league = League::findOrFail($id);

        if (!$league->teams()->where('team_id', $teamId)->exists()) {
            return response()->json(['message' => 'Team not in this league'], 404);
        }

        $league->teams()->updateExistingPivot($teamId, [
            'group_label' => $request->group_label,
        ]);

        return response()->json(['message' => 'Team updated in league'], 200);
    }
}