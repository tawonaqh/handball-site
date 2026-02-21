<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // This migration is OPTIONAL - only if you want separate season tracking
        // The system now uses the existing 'rankings' table by default
        
        Schema::create('team_standings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('league_id');
            $table->integer('season_year')->default(2025);
            $table->integer('games_played')->default(0);
            $table->integer('wins')->default(0);
            $table->integer('draws')->default(0);
            $table->integer('losses')->default(0);
            $table->integer('goals_for')->default(0);
            $table->integer('goals_against')->default(0);
            $table->integer('goal_difference')->default(0);
            $table->integer('points')->default(0);
            $table->integer('rank')->nullable();
            $table->timestamps();

            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('cascade');
            
            $table->unique(['team_id', 'league_id', 'season_year']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('team_standings');
    }
};
