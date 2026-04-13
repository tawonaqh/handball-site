<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id', 'team_id', 'played', 'wins', 'draws', 'losses', 
        'goals_for', 'goals_against', 'points'
    ];

    public function team() {
        return $this->belongsTo(Team::class);
    }

    public function league() {
        return $this->belongsTo(League::class);
    }
}
