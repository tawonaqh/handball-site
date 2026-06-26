<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return Team::with(['leagues', 'ranking'])->get();
    }

    public function show($id)
    {
        return Team::with(['players', 'leagues', 'ranking'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'gender' => 'nullable|in:men,women',
        ]);
        $team = Team::create($request->all());
        return response()->json($team, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'gender' => 'nullable|in:men,women',
        ]);
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
