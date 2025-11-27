<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'team_id', 'position', 'bio', 'goals', 'assists', 'matches_played'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}