<?php

// database/seeders/GallerySeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run()
    {
        Gallery::create(['title' => 'Tournament Highlights', 'media_url' => 'http://example.com/media1.jpg', 'media_type' => 'image', 'tournament_id' => 1]);
        Gallery::create(['title' => 'Team Celebration', 'media_url' => 'http://example.com/media2.jpg', 'media_type' => 'image', 'team_id' => 1]);
        Gallery::create(['media_url' => 'http://example.com/video1.mp4', 'media_type' => 'video', 'news_id' => 1]);
    }
}
