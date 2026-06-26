<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop foreign keys first
        Schema::table('games', function (Blueprint $table) {
            $table->dropForeign(['home_team_id']);
            $table->dropForeign(['away_team_id']);
        });

        // Make columns nullable (knockout brackets have TBD slots)
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedBigInteger('home_team_id')->nullable()->change();
            $table->unsignedBigInteger('away_team_id')->nullable()->change();
        });

        // Recreate foreign keys with set null on delete
        Schema::table('games', function (Blueprint $table) {
            $table->foreign('home_team_id')->references('id')->on('teams')->onDelete('set null');
            $table->foreign('away_team_id')->references('id')->on('teams')->onDelete('set null');
        });
    }

    public function down(): void
    {
        // Drop foreign keys with set null
        Schema::table('games', function (Blueprint $table) {
            $table->dropForeign(['home_team_id']);
            $table->dropForeign(['away_team_id']);
        });

        // Revert to not nullable
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedBigInteger('home_team_id')->nullable(false)->change();
            $table->unsignedBigInteger('away_team_id')->nullable(false)->change();
        });

        // Restore original cascade foreign keys
        Schema::table('games', function (Blueprint $table) {
            $table->foreign('home_team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('away_team_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }
};
