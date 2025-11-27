<?php

// database/seeders/AdSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ad;

class AdSeeder extends Seeder
{
    public function run()
    {
        Ad::create(['title' => 'Summer Sale', 'image_url' => 'http://example.com/ad1.jpg', 'link' => 'http://example.com/sale', 'start_date' => '2023-06-01', 'end_date' => '2023-08-31']);
        Ad::create(['title' => 'New Season Gear', 'image_url' => 'http://example.com/ad2.jpg', 'link' => 'http://example.com/gear', 'start_date' => '2023-07-01', 'end_date' => '2023-09-30']);
    }
}
