<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'home_team_id',
        'away_team_id',
        'match_date',
        'match_time',
        'venue',
        'round',
        'next_match_id',
        'bracket_slot',
        'group_label',
        'leg',
        'home_score',
        'away_score',
        'home_score_agg',
        'away_score_agg',
        'status',
        'referee_id',
        'live_data',
        'duration',
        'completed_at'
    ];

    protected $casts = [
        'live_data' => 'array',
        'match_date' => 'date',
        'completed_at' => 'datetime'
    ];

    public function referee()
    {
        return $this->belongsTo(Referee::class);
    }

    public function league() {
        return $this->belongsTo(League::class);
    }

    public function homeTeam() {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam() {
        return $this->belongsTo(Team::class, 'away_team_id');
    }
}
