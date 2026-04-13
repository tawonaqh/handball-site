<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->json('live_data')->nullable()->after('status');
            $table->integer('duration')->nullable()->after('live_data'); // in seconds
            $table->timestamp('completed_at')->nullable()->after('duration');
            $table->string('venue')->nullable()->after('match_date');
            $table->integer('round')->default(1)->after('venue');
            $table->time('match_time')->nullable()->after('match_date');
        });
    }

    public function down()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['live_data', 'duration', 'completed_at', 'venue', 'round', 'match_time']);
        });
    }
};
