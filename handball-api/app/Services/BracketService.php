<?php

namespace App\Services;

use App\Models\Game;
use App\Models\League;
use Carbon\Carbon;

class BracketService
{
    /**
     * Generate a round-robin fixture list for a league.
     * Supports single or double fixture (home/away).
     */
    public function generateRoundRobin(League $league, array $teamIds, string $startDate): array
    {
        $isDouble  = ($league->fixture_type ?? 'single') === 'double';
        $games     = [];
        $date      = Carbon::parse($startDate);
        $n         = count($teamIds);

        // Standard round-robin using circle method
        $teams = $teamIds;
        if ($n % 2 !== 0) {
            $teams[] = null; // bye
            $n++;
        }

        $rounds = $n - 1;
        $half   = $n / 2;

        for ($round = 0; $round < $rounds; $round++) {
            for ($match = 0; $match < $half; $match++) {
                $home = $teams[$match];
                $away = $teams[$n - 1 - $match];

                if ($home !== null && $away !== null) {
                    $games[] = [
                        'league_id'    => $league->id,
                        'home_team_id' => $home,
                        'away_team_id' => $away,
                        'match_date'   => $date->copy()->addDays($round * 7)->toDateString(),
                        'round'        => $round + 1,
                        'leg'          => 1,
                        'status'       => 'scheduled',
                    ];

                    if ($isDouble) {
                        $games[] = [
                            'league_id'    => $league->id,
                            'home_team_id' => $away,
                            'away_team_id' => $home,
                            'match_date'   => $date->copy()->addDays(($rounds + $round) * 7)->toDateString(),
                            'round'        => $rounds + $round + 1,
                            'leg'          => 2,
                            'status'       => 'scheduled',
                        ];
                    }
                }
            }

            // Rotate teams (keep first fixed)
            $last = array_pop($teams);
            array_splice($teams, 1, 0, [$last]);
        }

        return $games;
    }

    /**
     * Generate a knockout bracket with next_match_id pointers.
     * $slots: ordered array of team IDs (or null for TBD).
     * Returns created Game records.
     */
    public function generateKnockoutBracket(League $league, array $slots, string $startDate): array
    {
        $n     = count($slots);
        $round = (int) ceil(log($n, 2));
        $total = (int) pow(2, $round);

        // Pad with nulls (byes)
        while (count($slots) < $total) {
            $slots[] = null;
        }

        $date        = Carbon::parse($startDate);
        $roundLabels = $this->getRoundLabels($round);
        $createdGames = [];
        $currentRoundGames = [];

        // Create first round matches
        for ($i = 0; $i < $total; $i += 2) {
            $slot  = $roundLabels[0] . ($i / 2 + 1);
            $game  = Game::create([
                'league_id'    => $league->id,
                'home_team_id' => $slots[$i]     ?? $this->getByeTeamId(),
                'away_team_id' => $slots[$i + 1] ?? $this->getByeTeamId(),
                'match_date'   => $date->toDateString(),
                'round'        => 1,
                'bracket_slot' => $slot,
                'status'       => 'scheduled',
                'leg'          => 1,
            ]);
            $currentRoundGames[] = $game;
            $createdGames[]      = $game;
        }

        // Create subsequent rounds and link next_match_id
        for ($r = 1; $r < $round; $r++) {
            $nextRoundGames = [];
            $date->addDays(7);

            for ($i = 0; $i < count($currentRoundGames); $i += 2) {
                $slot = $roundLabels[$r] . ($i / 2 + 1);
                $next = Game::create([
                    'league_id'    => $league->id,
                    'home_team_id' => null,
                    'away_team_id' => null,
                    'match_date'   => $date->toDateString(),
                    'round'        => $r + 1,
                    'bracket_slot' => $slot,
                    'status'       => 'scheduled',
                    'leg'          => 1,
                ]);

                // Point current round games to this next match
                if (isset($currentRoundGames[$i])) {
                    $currentRoundGames[$i]->next_match_id = $next->id;
                    $currentRoundGames[$i]->save();
                }
                if (isset($currentRoundGames[$i + 1])) {
                    $currentRoundGames[$i + 1]->next_match_id = $next->id;
                    $currentRoundGames[$i + 1]->save();
                }

                $nextRoundGames[] = $next;
                $createdGames[]   = $next;
            }

            $currentRoundGames = $nextRoundGames;
        }

        return $createdGames;
    }

    /**
     * Advance winner to next bracket match after a game is finalized.
     */
    public function advanceWinner(Game $game): void
    {
        if (!$game->next_match_id) return;

        $homeScore = (int) $game->home_score;
        $awayScore = (int) $game->away_score;
        $winnerId  = $homeScore >= $awayScore ? $game->home_team_id : $game->away_team_id;

        $nextGame = Game::find($game->next_match_id);
        if (!$nextGame) return;

        // Slot winner into the next game
        if ($nextGame->home_team_id === null) {
            $nextGame->home_team_id = $winnerId;
        } else {
            $nextGame->away_team_id = $winnerId;
        }
        $nextGame->save();
    }

    /**
     * Slot wildcard qualifiers into quarter-final bracket avoiding group rematches.
     */
    public function slotWildcards(League $league, array $wildcardTeamIds, array $groupWinners): void
    {
        // Find QF games with empty slots
        $qfGames = Game::where('league_id', $league->id)
            ->where('bracket_slot', 'like', 'QF%')
            ->whereNull('away_team_id')
            ->orWhere(function ($q) use ($league) {
                $q->where('league_id', $league->id)
                  ->where('bracket_slot', 'like', 'QF%')
                  ->whereNull('home_team_id');
            })
            ->get();

        foreach ($wildcardTeamIds as $wildcardId) {
            foreach ($qfGames as $qf) {
                $opponent = $qf->home_team_id ?? $qf->away_team_id;
                // Avoid group-stage rematch
                if ($opponent && $this->playedInSameGroup($league->id, $wildcardId, $opponent)) {
                    continue;
                }
                if ($qf->home_team_id === null) {
                    $qf->home_team_id = $wildcardId;
                } else {
                    $qf->away_team_id = $wildcardId;
                }
                $qf->save();
                break;
            }
        }
    }

    private function playedInSameGroup(int $leagueId, int $teamA, int $teamB): bool
    {
        return Game::where('league_id', $leagueId)
            ->whereNotNull('group_label')
            ->where(function ($q) use ($teamA, $teamB) {
                $q->where(fn($q2) => $q2->where('home_team_id', $teamA)->where('away_team_id', $teamB))
                  ->orWhere(fn($q2) => $q2->where('home_team_id', $teamB)->where('away_team_id', $teamA));
            })
            ->exists();
    }

    private function getRoundLabels(int $totalRounds): array
    {
        $labels = ['F', 'SF', 'QF', 'R16', 'R32', 'R64'];
        $result = [];
        for ($i = 0; $i < $totalRounds; $i++) {
            $result[] = $labels[$totalRounds - 1 - $i] ?? "R{$i}";
        }
        return $result;
    }

    private function getByeTeamId(): ?int
    {
        return null; // Byes handled as null team slots
    }
}
