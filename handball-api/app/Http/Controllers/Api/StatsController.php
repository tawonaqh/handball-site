<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\League;
use App\Models\Player;
use App\Models\Team;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'active_leagues' => League::count(),
            'teams'          => Team::count(),
            'players'        => Player::count(),
            'matches'        => Game::count(),
        ]);
    }
}
