<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeagueController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\RefereeController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('leagues')->group(function () {
    Route::get('/', [LeagueController::class, 'index']);
    Route::get('/{id}', [LeagueController::class, 'show']);
    Route::post('/', [LeagueController::class, 'store']);
    Route::put('/{id}', [LeagueController::class, 'update']);
    Route::delete('/{id}', [LeagueController::class, 'destroy']);
});

Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index']);
    Route::get('/{id}', [NewsController::class, 'show']);
    Route::post('/', [NewsController::class, 'store']);
    Route::put('/{id}', [NewsController::class, 'update']);
    Route::delete('/{id}', [NewsController::class, 'destroy']);
});

Route::prefix('players')->group(function () {
    Route::get('/', [PlayerController::class, 'index']);
    Route::get('/{id}', [PlayerController::class, 'show']);
    Route::post('/', [PlayerController::class, 'store']);
    Route::put('/{id}', [PlayerController::class, 'update']);
    Route::delete('/{id}', [PlayerController::class, 'destroy']);
});

Route::prefix('teams')->group(function () {
    Route::get('/', [TeamController::class, 'index']);
    Route::get('/{id}', [TeamController::class, 'show']);
    Route::post('/', [TeamController::class, 'store']);
    Route::put('/{id}', [TeamController::class, 'update']);
    Route::delete('/{id}', [TeamController::class, 'destroy']);
});

Route::prefix('tournaments')->group(function () {
    Route::get('/', [TournamentController::class, 'index']);
    Route::get('/{id}', [TournamentController::class, 'show']);
    Route::post('/', [TournamentController::class, 'store']);
    Route::put('/{id}', [TournamentController::class, 'update']);
    Route::delete('/{id}', [TournamentController::class, 'destroy']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::prefix('games')->group(function () {
    Route::get('/', [GameController::class, 'index']);
    Route::get('/{id}', [GameController::class, 'show']);
    Route::post('/', [GameController::class, 'store']);
    Route::put('/{id}', [GameController::class, 'update']);
    Route::delete('/{id}', [GameController::class, 'destroy']);
});

Route::prefix('rankings')->group(function () {
    Route::get('/', [RankingController::class, 'index']);
    Route::get('/{id}', [RankingController::class, 'show']);
    Route::post('/', [RankingController::class, 'store']);
    Route::put('/{id}', [RankingController::class, 'update']);
    Route::delete('/{id}', [RankingController::class, 'destroy']);
});

Route::prefix('ads')->group(function () {
    Route::get('/', [AdController::class, 'index']);
    Route::get('/{id}', [AdController::class, 'show']);
    Route::post('/', [AdController::class, 'store']);
    Route::put('/{id}', [AdController::class, 'update']);
    Route::delete('/{id}', [AdController::class, 'destroy']);
});

Route::prefix('galleries')->group(function () {
    Route::get('/', [GalleryController::class, 'index']);
    Route::get('/{id}', [GalleryController::class, 'show']);
    Route::post('/', [GalleryController::class, 'store']);
    Route::put('/{id}', [GalleryController::class, 'update']);
    Route::delete('/{id}', [GalleryController::class, 'destroy']);
});

Route::prefix('referees')->group(function () {
    Route::get('/', [RefereeController::class, 'index']);
    Route::get('/{id}', [RefereeController::class, 'show']);
    Route::post('/', [RefereeController::class, 'store']);
    Route::put('/{id}', [RefereeController::class, 'update']);
    Route::delete('/{id}', [RefereeController::class, 'destroy']);
    Route::get('/tournament/{tournamentId}', [RefereeController::class, 'getByTournament']);
});
