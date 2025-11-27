<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referee;
use Illuminate\Http\Request;


class RefereeController extends Controller
{
    public function index()
    {
        return Referee::with('tournament')->get();
    }

    public function show($id)
    {
        return Referee::with(['tournament', 'games'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $referee = Referee::create($request->all());
        return response()->json($referee, 201);
    }

    public function update(Request $request, $id)
    {
        $referee = Referee::findOrFail($id);
        $referee->update($request->all());
        return response()->json($referee, 200);
    }

    public function destroy($id)
    {
        Referee::destroy($id);
        return response()->json(null, 204);
    }

    public function getByTournament($tournamentId)
    {
        return Referee::where('tournament_id', $tournamentId)
            ->with('tournament')
            ->get();
    }
}