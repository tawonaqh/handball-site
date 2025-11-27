<?php

// database/seeders/RankingSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ranking;

class RankingSeeder extends Seeder
{
    public function run()
    {
        Ranking::create(['league_id' => 1, 'team_id' => 1, 'played' => 5, 'wins' => 3, 'draws' => 1, 'losses' => 1, 'goals_for' => 10, 'goals_against' => 5, 'points' => 10]);
        Ranking::create(['league_id' => 1, 'team_id' => 2, 'played' => 5, 'wins' => 2, 'draws' => 2, 'losses' => 1, 'goals_for' => 8, 'goals_against' => 6, 'points' => 8]);
    }
}
