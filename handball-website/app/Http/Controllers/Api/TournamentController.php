<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    public function index()
    {
        // Load tournaments with leagues count
        return Tournament::withCount('leagues')->get();
    }

    public function show($id)
    {
        // Eager load leagues for this tournament
        return Tournament::with('leagues')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $tournament = Tournament::create($request->all());
        return response()->json($tournament, 201);
    }

    public function update(Request $request, $id)
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->update($request->all());
        return response()->json($tournament, 200);
    }

    public function destroy($id)
    {
        Tournament::destroy($id);
        return response()->json(null, 204);
    }
}
