<?php
// app/Models/Referee.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'license_number',
        'level',
        'tournament_id',
        'is_active'
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}