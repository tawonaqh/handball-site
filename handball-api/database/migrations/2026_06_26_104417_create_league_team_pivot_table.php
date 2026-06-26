<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create the pivot table
        Schema::create('league_team', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('league_id');
            $table->unsignedBigInteger('team_id');
            $table->string('group_label')->nullable();
            $table->timestamps();

            $table->unique(['league_id', 'team_id']);
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
        });

        // 2. Migrate existing data: copy league_id from teams into the pivot
        if (Schema::hasColumn('teams', 'league_id')) {
            $rows = DB::table('teams')
                ->whereNotNull('league_id')
                ->select('id as team_id', 'league_id')
                ->get();

            foreach ($rows as $row) {
                DB::table('league_team')->insertOrIgnore([
                    'league_id'  => $row->league_id,
                    'team_id'    => $row->team_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 3. Drop the old league_id FK and column from teams
            Schema::table('teams', function (Blueprint $table) {
                $table->dropForeign(['league_id']);
                $table->dropColumn('league_id');
            });
        }
    }

    public function down(): void
    {
        // Re-add league_id to teams
        Schema::table('teams', function (Blueprint $table) {
            $table->unsignedBigInteger('league_id')->nullable()->after('name');
            $table->foreign('league_id')->references('id')->on('leagues')->onDelete('cascade');
        });

        // Restore league_id from pivot data
        $rows = DB::table('league_team')->select('team_id', 'league_id')->get();
        foreach ($rows as $row) {
            DB::table('teams')
                ->where('id', $row->team_id)
                ->update(['league_id' => $row->league_id]);
        }

        Schema::dropIfExists('league_team');
    }
};