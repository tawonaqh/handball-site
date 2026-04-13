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
        'num_groups', 'teams_per_group', 'knockout_rounds',
        'win_points', 'draw_points', 'loss_points',
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