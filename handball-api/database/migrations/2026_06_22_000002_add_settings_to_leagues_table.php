<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->integer('match_duration')->default(60)->after('loss_points');
            $table->integer('overtime_halves')->default(2)->after('match_duration');
            $table->string('shootout_enabled')->default('yes')->after('overtime_halves');
            $table->integer('roster_limit')->default(16)->after('shootout_enabled');
            $table->json('tiebreaker_order')->nullable()->after('roster_limit');
            $table->string('knockout_method')->default('default')->after('tiebreaker_order');
        });
    }

    public function down(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn(['match_duration', 'overtime_halves', 'shootout_enabled', 'roster_limit', 'tiebreaker_order', 'knockout_method']);
        });
    }
};
