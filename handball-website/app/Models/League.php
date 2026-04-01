<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'gender', 'tournament_id',
        'type', 'season', 'description', 'max_teams',
        'num_groups', 'teams_per_group', 'knockout_rounds',
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