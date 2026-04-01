<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTournamentFieldsToLeaguesTable extends Migration
{
    public function up()
    {
        Schema::table('leagues', function (Blueprint $table) {
            // Make tournament_id optional — leagues can exist standalone
            $table->unsignedBigInteger('tournament_id')->nullable()->change();

            // Tournament config fields
            $table->string('type')->default('league')->after('name');         // 'league' or 'knockout'
            $table->string('season')->nullable()->after('type');
            $table->text('description')->nullable()->after('season');
            $table->integer('max_teams')->nullable()->after('description');

            // Knockout-specific fields
            $table->integer('num_groups')->nullable()->after('max_teams');
            $table->integer('teams_per_group')->nullable()->after('num_groups');
            $table->string('knockout_rounds')->nullable()->after('teams_per_group');
        });
    }

    public function down()
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->unsignedBigInteger('tournament_id')->nullable(false)->change();
            $table->dropColumn(['type', 'season', 'description', 'max_teams', 'num_groups', 'teams_per_group', 'knockout_rounds']);
        });
    }
}
