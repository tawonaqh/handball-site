<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('player_id');
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('league_id')->nullable();
            $table->integer('season_year')->default(2025);
            $table->integer('games_played')->default(0);
            $table->integer('total_goals')->default(0);
            $table->integer('total_suspensions')->default(0);
            $table->integer('red_cards')->default(0);
            $table->timestamps();

            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('cascade');
            
            $table->unique(['player_id', 'league_id', 'season_year']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('player_stats');
    }
};
