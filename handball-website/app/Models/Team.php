<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'league_id'];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function ranking()
    {
        return $this->hasOne(Ranking::class)->select(['id', 'team_id', 'points', 'league_id']);
    }
}