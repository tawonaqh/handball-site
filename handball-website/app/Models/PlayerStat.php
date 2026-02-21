<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'team_id',
        'league_id',
        'season_year',
        'games_played',
        'total_goals',
        'total_suspensions',
        'red_cards'
    ];

    protected $casts = [
        'games_played' => 'integer',
        'total_goals' => 'integer',
        'total_suspensions' => 'integer',
        'red_cards' => 'integer',
        'season_year' => 'integer'
    ];

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function getGoalsPerGameAttribute()
    {
        return $this->games_played > 0 
            ? round($this->total_goals / $this->games_played, 2) 
            : 0;
    }
}
