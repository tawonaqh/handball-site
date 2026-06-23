<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\League;
use App\Services\BracketService;
use App\Services\StandingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BracketController extends Controller
{
    public function __construct(
        private BracketService   $bracket,
        private StandingsService $standings
    ) {}

    /**
     * Get league settings.
     * GET /leagues/{id}/settings
     */
    public function getSettings($leagueId)
    {
        $league = League::findOrFail($leagueId);
        return response()->json([
            'match_duration'   => $league->match_duration ?? 60,
            'overtime_halves'  => $league->overtime_halves ?? 2,
            'shootout_enabled' => $league->shootout_enabled ?? 'yes',
            'roster_limit'     => $league->roster_limit ?? 16,
            'tiebreaker_order' => $league->tiebreaker_order ?? [
                'Head-to-Head Points',
                'Head-to-Head Goal Difference',
                'Head-to-Head Goals Scored',
                'Overall Goal Difference',
                'Overall Goals Scored',
                'Official Draw / Coin Toss',
            ],
            'knockout_method'  => $league->knockout_method ?? 'default',
        ]);
    }

    /**
     * Update league settings.
     * PUT /leagues/{id}/settings
     */
    public function updateSettings(Request $request, $leagueId)
    {
        $league = League::findOrFail($leagueId);
        $league->update($request->only([
            'match_duration', 'overtime_halves', 'shootout_enabled',
            'roster_limit', 'tiebreaker_order', 'knockout_method',
        ]));
        return response()->json(['success' => true]);
    }

    /**
     * Generate round-robin fixtures for a league (optionally for one group).
     * POST /leagues/{id}/generate-fixtures
     *
     * Body:
     *   team_ids[]   - team IDs to include
     *   start_date   - first match date
     *   group_label  - optional group label (e.g. "A") to stamp on all games
     */
    public function generateFixtures(Request $request, $leagueId)
    {
        $request->validate([
            'team_ids'    => 'required|array|min:2',
            'team_ids.*'  => 'exists:teams,id',
            'start_date'  => 'required|date',
            'group_label' => 'nullable|string|max:10',
        ]);

        try {
            DB::beginTransaction();

            $league = League::findOrFail($leagueId);
            $games  = $this->bracket->generateRoundRobin(
                $league,
                $request->team_ids,
                $request->start_date,
                $request->group_label ?? null
            );

            $created = collect($games)->map(fn($g) => Game::query()->create($g));

            // If a group_label was provided, also stamp it on the teams themselves
            if ($request->group_label) {
                \App\Models\Team::whereIn('id', $request->team_ids)
                    ->update(['group_label' => $request->group_label]);
            }

            DB::commit();

            return response()->json([
                'success'       => true,
                'fixture_type'  => $league->fixture_type,
                'group_label'   => $request->group_label,
                'games_created' => $created->count(),
                'games'         => $created,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate all group-stage fixtures at once from a groups map.
     * POST /leagues/{id}/generate-group-stage
     *
     * Body:
     *   groups: { "A": [teamId, ...], "B": [teamId, ...], ... }
     *   start_date: "2026-06-01"
     */
    public function generateGroupStage(Request $request, $leagueId)
    {
        $request->validate([
            'groups'            => 'required|array|min:1',
            'groups.*'          => 'array|min:2',
            'groups.*.*'        => 'integer|exists:teams,id',
            'start_date'        => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            $league      = League::findOrFail($leagueId);
            $totalGames  = 0;
            $allGames    = [];

            foreach ($request->groups as $groupLabel => $teamIds) {
                // Stamp group_label on each team
                \App\Models\Team::whereIn('id', $teamIds)
                    ->update(['group_label' => $groupLabel]);

                // Generate round-robin for this group
                $games = $this->bracket->generateRoundRobin(
                    $league,
                    $teamIds,
                    $request->start_date,
                    (string) $groupLabel
                );

                foreach ($games as $g) {
                    $allGames[] = Game::create($g);
                    $totalGames++;
                }
            }

            DB::commit();

            return response()->json([
                'success'       => true,
                'groups'        => array_keys($request->groups),
                'games_created' => $totalGames,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate knockout bracket for a league.
     * POST /leagues/{id}/generate-bracket
     */
    public function generateBracket(Request $request, $leagueId)
    {
        $request->validate([
            'team_ids'   => 'required|array|min:2',
            'team_ids.*' => 'nullable|integer',
            'start_date' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            $league = League::findOrFail($leagueId);
            $games  = $this->bracket->generateKnockoutBracket(
                $league,
                $request->team_ids,
                $request->start_date
            );

            DB::commit();

            return response()->json([
                'success'       => true,
                'games_created' => count($games),
                'games'         => $games,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get full bracket tree for a league.
     * GET /leagues/{id}/bracket
     */
    public function getBracket($leagueId)
    {
        $games = Game::with(['homeTeam', 'awayTeam'])
            ->where('league_id', $leagueId)
            ->whereNotNull('bracket_slot')
            ->orderBy('round')
            ->get()
            ->groupBy('round');

        return response()->json([
            'leagueId' => (int) $leagueId,
            'rounds'   => $games->map(fn($roundGames, $round) => [
                'round'  => $round,
                'games'  => $roundGames->map(fn($g) => [
                    'id'          => $g->id,
                    'slot'        => $g->bracket_slot,
                    'homeTeam'    => $g->homeTeam ? ['id' => $g->homeTeam->id, 'name' => $g->homeTeam->name] : null,
                    'awayTeam'    => $g->awayTeam ? ['id' => $g->awayTeam->id, 'name' => $g->awayTeam->name] : null,
                    'homeScore'   => $g->home_score,
                    'awayScore'   => $g->away_score,
                    'status'      => $g->status,
                    'nextMatchId' => $g->next_match_id,
                    'matchDate'   => $g->match_date,
                ]),
            ])->values(),
        ]);
    }

    /**
     * Slot wildcard qualifiers into QF bracket.
     * POST /leagues/{id}/slot-wildcards
     */
    public function slotWildcards(Request $request, $leagueId)
    {
        $request->validate([
            'wildcard_team_ids'  => 'required|array',
            'group_winner_ids'   => 'required|array',
        ]);

        try {
            $league = League::findOrFail($leagueId);
            $this->bracket->slotWildcards(
                $league,
                $request->wildcard_team_ids,
                $request->group_winner_ids
            );

            return response()->json(['success' => true, 'message' => 'Wildcards slotted into bracket']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get per-group standings with qualification markers.
     * GET /leagues/{id}/group-standings
     */
    public function getGroupStandings($leagueId)
    {
        try {
            $groups = $this->standings->getGroupStandings((int) $leagueId);
            return response()->json([
                'leagueId' => (int) $leagueId,
                'groups'   => $groups,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate a print-friendly rulebook for a league.
     * GET /leagues/{id}/rulebook
     */
    public function rulebook($leagueId)
    {
        $league = League::with(['teams', 'tournament'])->findOrFail($leagueId);
        $games  = Game::with(['homeTeam', 'awayTeam'])
            ->where('league_id', $leagueId)
            ->orderBy('match_date')
            ->orderBy('round')
            ->get();

        $typeLabels = [
            'league'          => 'League (Round Robin)',
            'knockout'        => 'Groups + Knockout',
            'knockout_only'   => 'Knockout Only (Direct Elimination)',
            'league_knockout' => 'League + Knockout',
        ];

        $title       = htmlspecialchars($league->name);
        $typeLabel   = htmlspecialchars($typeLabels[$league->type] ?? $league->type);
        $gender      = htmlspecialchars(ucfirst($league->gender ?? 'men') . "'s");
        $season      = htmlspecialchars($league->season ?? 'Current');
        $desc        = htmlspecialchars($league->description ?? '');
        $descBlock   = $desc ? "<p>{$desc}</p>" : '';

        $settingsHtml = '<h3>Match Settings</h3><table><tr><th>Setting</th><th>Value</th></tr>';
        $settingsHtml .= '<tr><td>Match Duration</td><td>' . ($league->match_duration ?? 60) . ' minutes</td></tr>';
        $settingsHtml .= '<tr><td>Overtime</td><td>' . ($league->overtime_halves ?? 2) . ' halves</td></tr>';
        $settingsHtml .= '<tr><td>Shootout</td><td>' . ucfirst($league->shootout_enabled ?? 'yes') . '</td></tr>';
        $settingsHtml .= '<tr><td>Roster Limit</td><td>' . ($league->roster_limit ?? 16) . ' players</td></tr>';

        if ($league->tiebreaker_order) {
            $tiebreakers = is_array($league->tiebreaker_order)
                ? $league->tiebreaker_order
                : json_decode($league->tiebreaker_order, true);
            if (is_array($tiebreakers)) {
                $settingsHtml .= '<tr><td>Tiebreaker Order</td><td><ol style="margin:0;padding-left:18px">';
                foreach ($tiebreakers as $tb) {
                    $settingsHtml .= '<li>' . htmlspecialchars($tb) . '</li>';
                }
                $settingsHtml .= '</ol></td></tr>';
            }
        }
        $settingsHtml .= '</table>';

        $teamsHtml = '<h3>Registered Teams (' . $league->teams->count() . ')</h3>';
        if ($league->teams->count() > 0) {
            $teamsHtml .= '<table><tr><th>#</th><th>Team Name</th></tr>';
            foreach ($league->teams as $i => $team) {
                $teamsHtml .= '<tr><td>' . ($i + 1) . '</td><td>' . htmlspecialchars($team->name) . '</td></tr>';
            }
            $teamsHtml .= '</table>';
        } else {
            $teamsHtml .= '<p>No teams registered yet.</p>';
        }

        $configHtml = '<h3>Competition Format</h3>';
        $configHtml .= '<table><tr><th>Config</th><th>Value</th></tr>';
        $configHtml .= '<tr><td>Type</td><td>' . $typeLabel . '</td></tr>';
        $configHtml .= '<tr><td>Gender</td><td>' . $gender . '</td></tr>';
        $configHtml .= '<tr><td>Season</td><td>' . $season . '</td></tr>';
        $configHtml .= '<tr><td>Max Teams</td><td>' . ($league->max_teams ?? 'N/A') . '</td></tr>';
        if ($league->type === 'knockout') {
            $configHtml .= '<tr><td>Groups</td><td>' . ($league->num_groups ?? 'N/A') . '</td></tr>';
            $configHtml .= '<tr><td>Teams per Group</td><td>' . ($league->teams_per_group ?? 'N/A') . '</td></tr>';
        }
        if ($league->type === 'league_knockout') {
            $configHtml .= '<tr><td>Teams to Knockout</td><td>' . ($league->qualify_spots ?? 'N/A') . '</td></tr>';
        }
        if ($league->knockout_rounds) {
            $configHtml .= '<tr><td>Knockout Rounds</td><td>' . htmlspecialchars(str_replace('_', ' ', ucwords($league->knockout_rounds, '_'))) . '</td></tr>';
        }
        $configHtml .= '</table>';

        $matchesHtml = '<h3>Match Schedule (' . $games->count() . ' matches)</h3>';
        if ($games->count() > 0) {
            $matchesHtml .= '<table><tr><th>Date</th><th>Home</th><th></th><th>Away</th><th>Round</th></tr>';
            foreach ($games as $game) {
                $home = $game->homeTeam ? htmlspecialchars($game->homeTeam->name) : 'TBD';
                $away = $game->awayTeam ? htmlspecialchars($game->awayTeam->name) : 'TBD';
                $date = $game->match_date ? date('d M Y', strtotime($game->match_date)) : 'TBD';
                $round = $game->round ? htmlspecialchars($game->round) : '-';
                $matchesHtml .= "<tr><td>{$date}</td><td>{$home}</td><td>vs</td><td>{$away}</td><td>{$round}</td></tr>";
            }
            $matchesHtml .= '</table>';
        } else {
            $matchesHtml .= '<p>No matches scheduled yet.</p>';
        }

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{$title} - Rulebook</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #333; }
  h1 { font-size: 28px; border-bottom: 3px solid #f97316; padding-bottom: 10px; }
  h2 { font-size: 20px; color: #f97316; margin-top: 30px; }
  h3 { font-size: 16px; color: #555; margin-top: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  th { background: #f97316; color: white; }
  tr:nth-child(even) { background: #f9f9f9; }
  .header { text-align: center; margin-bottom: 30px; }
  .header p { color: #666; }
  @media print { body { margin: 0; padding: 15px; } }
</style>
</head>
<body>
<div class="header">
  <h1>{$title}</h1>
  <p>Competition Rulebook &bull; {$gender} &bull; Season {$season}</p>
  {$descBlock}
</div>
{$configHtml}
{$settingsHtml}
{$teamsHtml}
{$matchesHtml}
</body>
</html>
HTML;

        return response($html, 200, ['Content-Type' => 'text/html']);
    }

    /**
     * Recalculate all standings for a league.
     * POST /leagues/{id}/recalculate
     */
    public function recalculate($leagueId)
    {
        try {
            $this->standings->recalculate((int) $leagueId);
            return response()->json([
                'success'   => true,
                'standings' => $this->standings->getStandings((int) $leagueId),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
