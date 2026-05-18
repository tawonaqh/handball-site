<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            // Which group this team belongs to within a league (e.g. 'A', 'B', 'C')
            $table->string('group_label')->nullable()->after('league_id');
        });

        Schema::table('leagues', function (Blueprint $table) {
            // How many teams qualify from each group to the knockout round (default 2)
            $table->integer('qualify_spots')->default(2)->after('teams_per_group');
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('group_label');
        });
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn('qualify_spots');
        });
    }
};
