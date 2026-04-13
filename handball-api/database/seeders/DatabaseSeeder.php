<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Optionally truncate the users table to prevent unique constraint violation
        // DB::table('users')->truncate();

        $this->call([
            UserSeeder::class,
            TournamentSeeder::class,
            LeagueSeeder::class,
            TeamSeeder::class,
            PlayerSeeder::class,
            NewsSeeder::class,
            GameSeeder::class,
            RankingSeeder::class,
            AdSeeder::class,
            GallerySeeder::class,
        ]);
    }
}
