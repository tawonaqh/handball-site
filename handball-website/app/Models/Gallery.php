<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'media_url', 'media_type', 'tournament_id', 'team_id', 'news_id'
    ];

    public function tournament() {
        return $this->belongsTo(Tournament::class);
    }

    public function team() {
        return $this->belongsTo(Team::class);
    }

    public function news() {
        return $this->belongsTo(News::class);
    }
}
