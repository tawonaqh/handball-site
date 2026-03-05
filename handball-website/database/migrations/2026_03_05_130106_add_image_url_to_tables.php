<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add logo_url to teams table if it doesn't exist
        if (!Schema::hasColumn('teams', 'logo_url')) {
            Schema::table('teams', function (Blueprint $table) {
                $table->string('logo_url')->nullable()->after('name');
            });
        }

        // Add photo_url to players table if it doesn't exist
        if (!Schema::hasColumn('players', 'photo_url')) {
            Schema::table('players', function (Blueprint $table) {
                $table->string('photo_url')->nullable()->after('name');
            });
        }

        // Add photo_url to referees table if it doesn't exist
        if (!Schema::hasColumn('referees', 'photo_url')) {
            Schema::table('referees', function (Blueprint $table) {
                $table->string('photo_url')->nullable()->after('name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('teams', 'logo_url')) {
            Schema::table('teams', function (Blueprint $table) {
                $table->dropColumn('logo_url');
            });
        }

        if (Schema::hasColumn('players', 'photo_url')) {
            Schema::table('players', function (Blueprint $table) {
                $table->dropColumn('photo_url');
            });
        }

        if (Schema::hasColumn('referees', 'photo_url')) {
            Schema::table('referees', function (Blueprint $table) {
                $table->dropColumn('photo_url');
            });
        }
    }
};
