<?php

namespace App\Services;

use App\Models\Game;
use App\Models\League;
use App\Models\Ranking;

class StandingsService
{
    /**
     * Fully recalculate standings for a league from scratch.
     * Called after any score edit or finalization.
     */
    public function recalculate(int $leagueId): void
    {
        $league = League::findOrFail($leagueId);

        $winPts  = $league->win_points  ?? 2;
        $drawPts = $league->draw_points ?? 1;
        $lossPts = $league->loss_points ?? 0;

        // Reset all rankings for this league
        Ranking::where('league_id', $leagueId)->update([
            'played'       => 0,
            'wins'         => 0,
            'draws'        => 0,
            'losses'       => 0,
            'goals_for'    => 0,
            'goals_against'=> 0,
            'points'       => 0,
        ]);

        // Fetch all completed games for this league
        $games = Game::where('league_id', $leagueId)
            ->where('status', 'completed')
            ->whereNotNull('home_score')
            ->whereNotNull('away_score')
            ->get();

        foreach ($games as $game) {
            $this->applyGameToRankings($game, $winPts, $drawPts, $lossPts);
        }
    }

    /**
     * Apply a single completed game result to rankings.
     * Used during finalization and recalculation.
     */
    public function applyGameToRankings(Game $game, int $winPts = 2, int $drawPts = 1, int $lossPts = 0): array
    {
        $homeScore = (int) $game->home_score;
        $awayScore = (int) $game->away_score;

        $homeRanking = Ranking::firstOrCreate(
            ['team_id' => $game->home_team_id, 'league_id' => $game->league_id],
            ['played' => 0, 'wins' => 0, 'draws' => 0, 'losses' => 0,
             'goals_for' => 0, 'goals_against' => 0, 'points' => 0]
        );

        $awayRanking = Ranking::firstOrCreate(
            ['team_id' => $game->away_team_id, 'league_id' => $game->league_id],
            ['played' => 0, 'wins' => 0, 'draws' => 0, 'losses' => 0,
             'goals_for' => 0, 'goals_against' => 0, 'points' => 0]
        );

        $homeRanking->played      += 1;
        $homeRanking->goals_for   += $homeScore;
        $homeRanking->goals_against += $awayScore;

        $awayRanking->played      += 1;
        $awayRanking->goals_for   += $awayScore;
        $awayRanking->goals_against += $homeScore;

        $pointsAwarded = ['homeTeam' => 0, 'awayTeam' => 0];

        if ($homeScore > $awayScore) {
            // Home win
            $homeRanking->wins   += 1;
            $homeRanking->points += $winPts;
            $awayRanking->losses += 1;
            $awayRanking->points += $lossPts;
            $pointsAwarded = ['homeTeam' => $winPts, 'awayTeam' => $lossPts];
        } elseif ($awayScore > $homeScore) {
            // Away win
            $awayRanking->wins   += 1;
            $awayRanking->points += $winPts;
            $homeRanking->losses += 1;
            $homeRanking->points += $lossPts;
            $pointsAwarded = ['homeTeam' => $lossPts, 'awayTeam' => $winPts];
        } else {
            // DRAW — both teams get draw_points, draws column incremented
            $homeRanking->draws  += 1;
            $homeRanking->points += $drawPts;
            $awayRanking->draws  += 1;
            $awayRanking->points += $drawPts;
            $pointsAwarded = ['homeTeam' => $drawPts, 'awayTeam' => $drawPts];
        }

        $homeRanking->save();
        $awayRanking->save();

        return $pointsAwarded;
    }

    /**
     * Get sorted standings for a league (Points > GD > Goals For > H2H).
     */
    public function getStandings(int $leagueId): \Illuminate\Support\Collection
    {
        return Ranking::with('team')
            ->where('league_id', $leagueId)
            ->orderBy('points', 'desc')
            ->orderByRaw('(goals_for - goals_against) DESC')
            ->orderBy('goals_for', 'desc')
            ->get()
            ->values()
            ->map(function ($r, $i) {
                return [
                    'rank'           => $i + 1,
                    'team'           => ['id' => $r->team->id, 'name' => $r->team->name],
                    'gamesPlayed'    => $r->played,
                    'wins'           => $r->wins,
                    'draws'          => $r->draws,
                    'losses'         => $r->losses,
                    'goalsFor'       => $r->goals_for,
                    'goalsAgainst'   => $r->goals_against,
                    'goalDifference' => $r->goals_for - $r->goals_against,
                    'points'         => $r->points,
                ];
            });
    }

    /**
     * Build a virtual wildcard table from 3rd-place teams across groups.
     * Ranks them by: Points > GD > Goals Scored.
     */
    public function getWildcardTable(int $leagueId, int $topN = 4): array
    {
        $standings = $this->getStandings($leagueId);

        // Group standings by group_label via games
        $groups = Game::where('league_id', $leagueId)
            ->whereNotNull('group_label')
            ->select('group_label')
            ->distinct()
            ->pluck('group_label');

        $thirdPlaceTeams = [];

        foreach ($groups as $group) {
            // Get team IDs that played in this group
            $teamIds = Game::where('league_id', $leagueId)
                ->where('group_label', $group)
                ->get()
                ->flatMap(fn($g) => [$g->home_team_id, $g->away_team_id])
                ->unique()
                ->values();

            // Filter standings to this group's teams, already sorted
            $groupStandings = $standings->filter(fn($s) => $teamIds->contains($s['team']['id']))->values();

            if ($groupStandings->count() >= 3) {
                $third = $groupStandings[2];
                $third['group'] = $group;
                $thirdPlaceTeams[] = $third;
            }
        }

        // Sort virtual table: Points > GD > Goals For
        usort($thirdPlaceTeams, function ($a, $b) {
            if ($b['points'] !== $a['points']) return $b['points'] - $a['points'];
            if ($b['goalDifference'] !== $a['goalDifference']) return $b['goalDifference'] - $a['goalDifference'];
            return $b['goalsFor'] - $a['goalsFor'];
        });

        return array_slice($thirdPlaceTeams, 0, $topN);
    }
}
