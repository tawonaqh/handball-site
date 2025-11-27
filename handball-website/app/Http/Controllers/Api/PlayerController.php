<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        return Player::with('team.league.tournament')->get();
    }

    public function show($id)
    {
        return Player::with('team.league.tournament')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $player = Player::create($request->all());
        return response()->json($player, 201);
    }

    public function update(Request $request, $id)
    {
        $player = Player::findOrFail($id);
        $player->update($request->all());
        return response()->json($player, 200);
    }

    public function destroy($id)
    {
        Player::destroy($id);
        return response()->json(null, 204);
    }
}