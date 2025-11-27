<?php

// database/seeders/NewsSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;

class NewsSeeder extends Seeder
{
    public function run()
    {
        News::create(['title' => 'Tournament Starts Soon', 'content' => 'The summer tournament is about to start!', 'author_id' => 1]);
        News::create(['title' => 'League Updates', 'content' => 'The league standings have been updated.', 'author_id' => 1]);
    }
}
