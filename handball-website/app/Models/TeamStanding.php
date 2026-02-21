<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamStanding extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'league_id',
        'season_year',
        'games_played',
        'wins',
        'draws',
        'losses',
        'goals_for',
        'goals_against',
        'goal_difference',
        'points',
        'rank'
    ];

    protected $casts = [
        'games_played' => 'integer',
        'wins' => 'integer',
        'draws' => 'integer',
        'losses' => 'integer',
        'goals_for' => 'integer',
        'goals_against' => 'integer',
        'goal_difference' => 'integer',
        'points' => 'integer',
        'rank' => 'integer',
        'season_year' => 'integer'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function league()
    {
        return $this->belongsTo(League::class);
    }
}
