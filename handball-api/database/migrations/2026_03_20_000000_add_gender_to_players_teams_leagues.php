<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGenderToPlayersTeamsLeagues extends Migration
{
    public function up()
    {
        Schema::table('players', function (Blueprint $table) {
            $table->enum('gender', ['men', 'women'])->default('men')->after('name');
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->enum('gender', ['men', 'women'])->default('men')->after('name');
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->enum('gender', ['men', 'women'])->default('men')->after('name');
        });
    }

    public function down()
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn('gender');
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('gender');
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
}
