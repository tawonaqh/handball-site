<?php

// database/seeders/TeamSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;

class TeamSeeder extends Seeder
{
    public function run()
    {
        Team::create(['name' => 'Team A', 'league_id' => 1]);
        Team::create(['name' => 'Team B', 'league_id' => 1]);
    }
}
