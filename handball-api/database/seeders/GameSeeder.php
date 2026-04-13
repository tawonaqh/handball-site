<?php

// database/seeders/GameSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;

class GameSeeder extends Seeder
{
    public function run()
    {
        Game::create(['league_id' => 1, 'home_team_id' => 1, 'away_team_id' => 2, 'match_date' => '2023-07-15 15:00:00']);
        Game::create(['league_id' => 1, 'home_team_id' => 2, 'away_team_id' => 1, 'match_date' => '2023-07-22 15:00:00']);
    }
}
