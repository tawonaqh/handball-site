<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_referees_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefereesTable extends Migration
{
    public function up()
    {
        Schema::create('referees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('license_number')->nullable();
            $table->string('level')->default('regional'); // regional, national, international
            $table->foreignId('tournament_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add referee_id to games table
        Schema::table('games', function (Blueprint $table) {
            $table->foreignId('referee_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropForeign(['referee_id']);
            $table->dropColumn('referee_id');
        });
        
        Schema::dropIfExists('referees');
    }
}