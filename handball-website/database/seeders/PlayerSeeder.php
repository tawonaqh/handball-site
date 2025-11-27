<?php

// database/seeders/PlayerSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Player;

class PlayerSeeder extends Seeder
{
    public function run()
    {
        Player::create(['name' => 'Player 1', 'team_id' => 1, 'position' => 'Forward']);
        Player::create(['name' => 'Player 2', 'team_id' => 1, 'position' => 'Defender']);
    }
}