<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'gender', 'group_label', 'logo_url'];

    public function leagues()
    {
        return $this->belongsToMany(League::class, 'league_team')->withPivot('group_label')->withTimestamps();
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function ranking()
    {
        return $this->hasOne(Ranking::class)->select(['id', 'team_id', 'points', 'league_id']);
    }

    public function standings()
    {
        return $this->hasMany(TeamStanding::class);
    }
}