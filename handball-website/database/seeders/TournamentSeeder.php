<?php

// database/seeders/TournamentSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tournament;

class TournamentSeeder extends Seeder
{
    public function run()
    {
        Tournament::create(['name' => 'Summer Tournament', 'start_date' => '2023-06-01', 'end_date' => '2023-08-31']);
        Tournament::create(['name' => 'Winter Tournament', 'start_date' => '2023-12-01', 'end_date' => '2024-02-28']);
    }
}
