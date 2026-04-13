<?php

// database/seeders/LeagueSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\League;

class LeagueSeeder extends Seeder
{
    public function run()
    {
        League::create(['name' => 'Premier League', 'tournament_id' => 1]);
        League::create(['name' => 'Championship', 'tournament_id' => 1]);
    }
}
