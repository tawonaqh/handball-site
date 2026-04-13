<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('player_stats', function (Blueprint $table) {
            // Offensive
            $table->integer('total_assists')->default(0)->after('total_goals');
            // Goalkeeping
            $table->integer('total_saves')->default(0)->after('total_assists');
            $table->decimal('save_rate', 5, 2)->default(0)->after('total_saves'); // percentage
            // Disciplinary
            $table->integer('yellow_cards')->default(0)->after('red_cards');
            $table->integer('blue_cards')->default(0)->after('yellow_cards');
            // 2-min suspensions already tracked as total_suspensions
        });

        // Add fixture_type and draw_points to leagues
        Schema::table('leagues', function (Blueprint $table) {
            $table->string('fixture_type')->default('single')->after('type'); // 'single' or 'double'
            $table->integer('win_points')->default(2)->after('fixture_type');
            $table->integer('draw_points')->default(1)->after('win_points');
            $table->integer('loss_points')->default(0)->after('draw_points');
        });

        // Add bracket fields to games
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedBigInteger('next_match_id')->nullable()->after('round');
            $table->string('bracket_slot')->nullable()->after('next_match_id'); // e.g. 'QF1', 'SF1', 'F'
            $table->string('group_label')->nullable()->after('bracket_slot');   // e.g. 'A', 'B', 'C'
            $table->integer('leg')->default(1)->after('group_label');           // 1 or 2 for double fixture
            $table->integer('home_score_agg')->nullable()->after('leg');        // aggregate scores
            $table->integer('away_score_agg')->nullable()->after('home_score_agg');
        });
    }

    public function down(): void
    {
        Schema::table('player_stats', function (Blueprint $table) {
            $table->dropColumn(['total_assists', 'total_saves', 'save_rate', 'yellow_cards', 'blue_cards']);
        });
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn(['fixture_type', 'win_points', 'draw_points', 'loss_points']);
        });
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['next_match_id', 'bracket_slot', 'group_label', 'leg', 'home_score_agg', 'away_score_agg']);
        });
    }
};
