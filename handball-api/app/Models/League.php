<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'gender', 'tournament_id',
        'type', 'fixture_type', 'season', 'description', 'max_teams',
        'num_groups', 'teams_per_group', 'qualify_spots', 'knockout_rounds',
        'win_points', 'draw_points', 'loss_points',
        'match_duration', 'overtime_halves', 'shootout_enabled', 'roster_limit',
        'tiebreaker_order', 'knockout_method',
    ];

    protected $casts = [
        'tiebreaker_order' => 'array',
    ];

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function tournament() 
    {
        return $this->belongsTo(Tournament::class);
    }
}