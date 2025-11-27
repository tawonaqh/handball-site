<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGalleriesTable extends Migration
{
    public function up()
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('media_url');
            $table->enum('media_type', ['image', 'video'])->default('image');
            $table->unsignedBigInteger('tournament_id')->nullable();
            $table->unsignedBigInteger('team_id')->nullable();
            $table->unsignedBigInteger('news_id')->nullable();
            $table->timestamps();

            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('news_id')->references('id')->on('news')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('galleries');
    }
}
