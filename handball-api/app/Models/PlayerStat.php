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
        'total_assists',
        'total_saves',
        'save_rate',
        'total_suspensions',
        'red_cards',
        'yellow_cards',
        'blue_cards',
    ];

    protected $casts = [
        'games_played'      => 'integer',
        'total_goals'       => 'integer',
        'total_assists'     => 'integer',
        'total_saves'       => 'integer',
        'save_rate'         => 'float',
        'total_suspensions' => 'integer',
        'red_cards'         => 'integer',
        'yellow_cards'      => 'integer',
        'blue_cards'        => 'integer',
        'season_year'       => 'integer',
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
