<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Ranking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LiveMatchController extends Controller
{
    /**
     * Get live match data (Public endpoint)
     */
    public function getLiveMatch($id)
    {
        try {
            $game = Game::with(['homeTeam.players', 'awayTeam.players', 'league'])
                ->findOrFail($id);

            if (!$game->live_data) {
                return response()->json([
                    'gameId' => $game->id,
                    'time' => 0,
                    'isRunning' => false,
                    'teamAName' => $game->homeTeam->name,
                    'teamBName' => $game->awayTeam->name,
                    'scoreA' => $game->home_score ?? 0,
                    'scoreB' => $game->away_score ?? 0,
                    'playersA' => [],
                    'playersB' => [],
                    'onCourtA' => [],
                    'onCourtB' => [],
                    'activeFouls' => [],
                    'matchLog' => [],
                    'timestamp' => now()->toIso8601String()
                ]);
            }

            return response()->json($game->live_data);
        } catch (\Exception $e) {
            Log::error('Error fetching live match: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch live match data'], 500);
        }
    }

    /**
     * Get match initialization data with real players
     */
    public function getMatchInitData($id)
    {
        try {
            $game = Game::with(['homeTeam.players', 'awayTeam.players', 'league'])
                ->findOrFail($id);

            // If live data exists, return it
            if ($game->live_data) {
                return response()->json($game->live_data);
            }

            // Otherwise, initialize with real players
            $playersA = $game->homeTeam->players->map(function ($player, $index) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'number' => $player->jersey_number ?? ($index + 1),
                    'goals' => 0,
                    'suspensions' => 0,
                    'isRedCarded' => false
                ];
            })->values()->toArray();

            $playersB = $game->awayTeam->players->map(function ($player, $index) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'number' => $player->jersey_number ?? ($index + 1),
                    'goals' => 0,
                    'suspensions' => 0,
                    'isRedCarded' => false
                ];
            })->values()->toArray();

            // Select first 7 players as starting lineup
            $onCourtA = array_slice(array_column($playersA, 'id'), 0, min(7, count($playersA)));
            $onCourtB = array_slice(array_column($playersB, 'id'), 0, min(7, count($playersB)));

            return response()->json([
                'gameId' => $game->id,
                'time' => 0,
                'isRunning' => false,
                'teamAName' => $game->homeTeam->name,
                'teamBName' => $game->awayTeam->name,
                'playersA' => $playersA,
                'playersB' => $playersB,
                'onCourtA' => $onCourtA,
                'onCourtB' => $onCourtB,
                'activeFouls' => [],
                'matchLog' => [],
                'timestamp' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching match init data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch match data'], 500);
        }
    }

    /**
     * Get live match data (Public endpoint)
     */


    /**
     * Update live match state (Admin endpoint)
     */
    public function updateLiveMatch(Request $request, $id)
    {
        try {
            $game = Game::findOrFail($id);
            
            $liveData = $request->all();
            $liveData['timestamp'] = now()->toIso8601String();
            
            $game->live_data = $liveData;
            $game->status = 'live';
            $game->home_score = $liveData['scoreA'] ?? 0;
            $game->away_score = $liveData['scoreB'] ?? 0;
            $game->save();

            return response()->json([
                'success' => true,
                'message' => 'Match state saved',
                'timestamp' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating live match: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to update match state'
            ], 500);
        }
    }

    /**
     * Finalize match and update all statistics
     */
    public function finalizeMatch(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $game = Game::with(['homeTeam', 'awayTeam', 'league'])->findOrFail($id);
            $data = $request->all();

            // 1. Update game record
            $game->status = 'completed';
            $game->home_score = $data['homeScore'];
            $game->away_score = $data['awayScore'];
            $game->duration = $data['duration'] ?? 0;
            $game->completed_at = now();
            $game->save();

            $currentYear = date('Y');
            $playerStatsUpdated = 0;

            // 2. Update player statistics for home team
            foreach ($data['playersA'] ?? [] as $playerData) {
                $player = Player::find($playerData['playerId']);
                if (!$player) continue;

                // Update player's overall stats
                $player->goals += $playerData['goals'];
                $player->matches_played += 1;
                $player->save();

                // Update or create player stats for this league/season
                $stats = PlayerStat::firstOrCreate(
                    [
                        'player_id' => $player->id,
                        'league_id' => $game->league_id,
                        'season_year' => $currentYear
                    ],
                    [
                        'team_id' => $game->home_team_id,
                        'games_played' => 0,
                        'total_goals' => 0,
                        'total_suspensions' => 0,
                        'red_cards' => 0
                    ]
                );

                $stats->games_played += 1;
                $stats->total_goals += $playerData['goals'];
                $stats->total_suspensions += $playerData['suspensions'];
                if ($playerData['redCard']) {
                    $stats->red_cards += 1;
                }
                $stats->save();
                $playerStatsUpdated++;
            }

            // 3. Update player statistics for away team
            foreach ($data['playersB'] ?? [] as $playerData) {
                $player = Player::find($playerData['playerId']);
                if (!$player) continue;

                // Update player's overall stats
                $player->goals += $playerData['goals'];
                $player->matches_played += 1;
                $player->save();

                // Update or create player stats for this league/season
                $stats = PlayerStat::firstOrCreate(
                    [
                        'player_id' => $player->id,
                        'league_id' => $game->league_id,
                        'season_year' => $currentYear
                    ],
                    [
                        'team_id' => $game->away_team_id,
                        'games_played' => 0,
                        'total_goals' => 0,
                        'total_suspensions' => 0,
                        'red_cards' => 0
                    ]
                );

                $stats->games_played += 1;
                $stats->total_goals += $playerData['goals'];
                $stats->total_suspensions += $playerData['suspensions'];
                if ($playerData['redCard']) {
                    $stats->red_cards += 1;
                }
                $stats->save();
                $playerStatsUpdated++;
            }

            // 4. Update team standings (using existing rankings table)
            $homeScore = $data['homeScore'];
            $awayScore = $data['awayScore'];

            // Get or create home team ranking
            $homeRanking = Ranking::firstOrCreate(
                [
                    'team_id' => $game->home_team_id,
                    'league_id' => $game->league_id
                ],
                [
                    'played' => 0,
                    'wins' => 0,
                    'draws' => 0,
                    'losses' => 0,
                    'goals_for' => 0,
                    'goals_against' => 0,
                    'points' => 0
                ]
            );

            // Get or create away team ranking
            $awayRanking = Ranking::firstOrCreate(
                [
                    'team_id' => $game->away_team_id,
                    'league_id' => $game->league_id
                ],
                [
                    'played' => 0,
                    'wins' => 0,
                    'draws' => 0,
                    'losses' => 0,
                    'goals_for' => 0,
                    'goals_against' => 0,
                    'points' => 0
                ]
            );

            // Update home team ranking
            $homeRanking->played += 1;
            $homeRanking->goals_for += $homeScore;
            $homeRanking->goals_against += $awayScore;

            // Update away team ranking
            $awayRanking->played += 1;
            $awayRanking->goals_for += $awayScore;
            $awayRanking->goals_against += $homeScore;

            // Award points
            $pointsAwarded = ['homeTeam' => 0, 'awayTeam' => 0];

            if ($homeScore > $awayScore) {
                // Home team wins
                $homeRanking->wins += 1;
                $homeRanking->points += 2;
                $awayRanking->losses += 1;
                $pointsAwarded['homeTeam'] = 2;
            } elseif ($awayScore > $homeScore) {
                // Away team wins
                $awayRanking->wins += 1;
                $awayRanking->points += 2;
                $homeRanking->losses += 1;
                $pointsAwarded['awayTeam'] = 2;
            } else {
                // Draw
                $homeRanking->draws += 1;
                $homeRanking->points += 1;
                $awayRanking->draws += 1;
                $awayRanking->points += 1;
                $pointsAwarded['homeTeam'] = 1;
                $pointsAwarded['awayTeam'] = 1;
            }

            $homeRanking->save();
            $awayRanking->save();

            // 5. Update league rankings
            $this->updateLeagueRankings($game->league_id, $currentYear);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Match finalized successfully',
                'updates' => [
                    'gameStatus' => 'completed',
                    'playerStatsUpdated' => $playerStatsUpdated,
                    'teamStandingsUpdated' => 2,
                    'leagueRankingsUpdated' => true,
                    'pointsAwarded' => $pointsAwarded
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error finalizing match: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to finalize match: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update league rankings based on standings
     */
    private function updateLeagueRankings($leagueId, $seasonYear)
    {
        // Using existing rankings table - no need to update ranks separately
        // Rankings are already ordered by points, goal difference in queries
    }

    /**
     * Get league standings
     */
    public function getLeagueStandings($leagueId)
    {
        try {
            $standings = Ranking::with('team')
                ->where('league_id', $leagueId)
                ->orderBy('points', 'desc')
                ->orderByRaw('(goals_for - goals_against) DESC')
                ->orderBy('goals_for', 'desc')
                ->get();

            return response()->json($standings->map(function ($standing, $index) {
                return [
                    'rank' => $index + 1,
                    'team' => [
                        'id' => $standing->team->id,
                        'name' => $standing->team->name
                    ],
                    'gamesPlayed' => $standing->played,
                    'wins' => $standing->wins,
                    'draws' => $standing->draws,
                    'losses' => $standing->losses,
                    'goalsFor' => $standing->goals_for,
                    'goalsAgainst' => $standing->goals_against,
                    'goalDifference' => $standing->goals_for - $standing->goals_against,
                    'points' => $standing->points
                ];
            }));
        } catch (\Exception $e) {
            Log::error('Error fetching league standings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch standings'], 500);
        }
    }

    /**
     * Get player rankings
     */
    public function getPlayerRankings(Request $request)
    {
        try {
            $seasonYear = $request->get('season', date('Y'));
            $category = $request->get('category', 'top_scorer');
            $leagueId = $request->get('league_id');

            $query = PlayerStat::with(['player', 'team'])
                ->where('season_year', $seasonYear);

            if ($leagueId) {
                $query->where('league_id', $leagueId);
            }

            if ($category === 'top_scorer') {
                $stats = $query->orderBy('total_goals', 'desc')
                    ->orderBy('games_played', 'asc')
                    ->limit(20)
                    ->get();

                return response()->json($stats->map(function ($stat, $index) {
                    return [
                        'rank' => $index + 1,
                        'player' => [
                            'id' => $stat->player->id,
                            'name' => $stat->player->name
                        ],
                        'team' => [
                            'id' => $stat->team->id,
                            'name' => $stat->team->name
                        ],
                        'goals' => $stat->total_goals,
                        'gamesPlayed' => $stat->games_played,
                        'average' => $stat->goals_per_game
                    ];
                }));
            }

            return response()->json(['error' => 'Invalid category'], 400);
        } catch (\Exception $e) {
            Log::error('Error fetching player rankings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch rankings'], 500);
        }
    }
}
