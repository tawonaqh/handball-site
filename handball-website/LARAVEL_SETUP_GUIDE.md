# Laravel Live Match Tracking - Setup Guide

## What Was Created

### Database Migrations (4 files)
1. `2025_02_21_000001_add_live_tracking_fields_to_games_table.php` - Adds live tracking fields to games
2. `2025_02_21_000002_create_player_stats_table.php` - Player statistics per season/league
3. `2025_02_21_000003_create_team_standings_table.php` - Team standings per season/league
4. `2025_02_21_000004_add_jersey_number_to_players_table.php` - Adds jersey number to players

### Models (2 new)
1. `app/Models/PlayerStat.php` - Player statistics model
2. `app/Models/TeamStanding.php` - Team standings model

### Controllers (1 new)
1. `app/Http/Controllers/Api/LiveMatchController.php` - Handles all live match operations

### Updated Files
1. `app/Models/Game.php` - Added live_data, duration, completed_at fields
2. `app/Models/Player.php` - Added jersey_number and stats relationship
3. `app/Models/Team.php` - Added standings relationship
4. `app/Http/Controllers/Api/GameController.php` - Include players in game response
5. `routes/api.php` - Added live match routes

## Setup Instructions

### Step 1: Run Migrations

```bash
cd handball-website
php artisan migrate
```

This will create the necessary database tables.

### Step 2: Add Jersey Numbers to Existing Players (Optional)

If you have existing players without jersey numbers, you can update them:

```bash
php artisan tinker
```

Then run:
```php
// Assign sequential jersey numbers to players
$teams = App\Models\Team::with('players')->get();
foreach ($teams as $team) {
    $number = 1;
    foreach ($team->players as $player) {
        $player->jersey_number = $number++;
        $player->save();
    }
}
```

### Step 3: Configure CORS (if needed)

Update `config/cors.php` to allow requests from your frontend:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    'http://localhost:3000',
    env('FRONTEND_URL', 'http://localhost:3000')
],
```

### Step 4: Test the API

Start your Laravel server:
```bash
php artisan serve
```

Test the endpoints:

```bash
# Get live match data
curl http://localhost:8000/api/games/1/live

# Get league standings
curl http://localhost:8000/api/leagues/1/standings

# Get player rankings
curl http://localhost:8000/api/rankings/players?season=2025&category=top_scorer
```

## API Endpoints

### Public Endpoints

```
GET  /api/games/{id}/live
     Returns current live match state

GET  /api/leagues/{id}/standings
     Returns league standings table

GET  /api/rankings/players?season={year}&category={category}&league_id={id}
     Returns player rankings
     Categories: top_scorer
```

### Admin Endpoints

```
POST /api/games/{id}/live-update
     Updates live match state
     Body: { gameId, time, isRunning, teamAName, teamBName, playersA, playersB, ... }

POST /api/games/{id}/finalize
     Finalizes match and updates all statistics
     Body: { gameId, homeScore, awayScore, playersA, playersB, duration }
```

## Database Schema

### games table (updated)
- Added: `live_data` (JSON) - Stores live match state
- Added: `duration` (INT) - Match duration in seconds
- Added: `completed_at` (TIMESTAMP) - When match was completed
- Added: `venue` (VARCHAR) - Match venue
- Added: `round` (INT) - Round number
- Added: `match_time` (TIME) - Match time

### player_stats table (new)
- `player_id` - Foreign key to players
- `team_id` - Foreign key to teams
- `league_id` - Foreign key to leagues
- `season_year` - Season year (e.g., 2025)
- `games_played` - Total games played
- `total_goals` - Total goals scored
- `total_suspensions` - Total 2-minute suspensions
- `red_cards` - Total red cards

### team_standings table (new)
- `team_id` - Foreign key to teams
- `league_id` - Foreign key to leagues
- `season_year` - Season year
- `games_played` - Total games played
- `wins` - Total wins
- `draws` - Total draws
- `losses` - Total losses
- `goals_for` - Goals scored
- `goals_against` - Goals conceded
- `goal_difference` - Goal difference
- `points` - Total points (Win: 2, Draw: 1, Loss: 0)
- `rank` - Current rank in league

### players table (updated)
- Added: `jersey_number` (VARCHAR) - Player's jersey number

## How It Works

### 1. Admin Starts Live Tracking
- Admin navigates to `/admin/games/{id}/live`
- Frontend loads game data including players from backend
- Admin starts match timer and tracks events

### 2. Auto-Save (Every 5 seconds)
- Frontend sends POST to `/api/games/{id}/live-update`
- Backend saves entire match state to `games.live_data` (JSON)
- Updates `games.home_score` and `games.away_score`
- Sets `games.status` to 'live'

### 3. Viewers Watch Live
- Viewers navigate to `/fixtures/{id}/live`
- Frontend polls GET `/api/games/{id}/live` every 2 seconds
- Backend returns current match state from `games.live_data`

### 4. Admin Finalizes Match
- Admin clicks "Finalize Match"
- Frontend sends POST to `/api/games/{id}/finalize`
- Backend performs database transaction:
  
  a. **Update Game Record**
     - Set status to 'completed'
     - Set final scores
     - Set completed_at timestamp
  
  b. **Update Player Statistics**
     - For each player in the match:
       - Update `players.goals` and `players.matches_played`
       - Create/update `player_stats` record for this season/league
       - Track goals, suspensions, red cards
  
  c. **Update Team Standings**
     - Create/update `team_standings` for both teams
     - Update games played, wins/draws/losses
     - Update goals for/against, goal difference
     - Award points: Win = 2, Draw = 1, Loss = 0
  
  d. **Recalculate Rankings**
     - Order teams by: points DESC, goal_difference DESC, goals_for DESC
     - Update rank field for all teams in league

### 5. View Updated Stats
- League standings: `/api/leagues/{id}/standings`
- Player rankings: `/api/rankings/players`

## Point System

- **Win**: 2 points
- **Draw**: 1 point
- **Loss**: 0 points

## Ranking Calculation

Teams are ranked by:
1. Total points (descending)
2. Goal difference (descending)
3. Goals scored (descending)

## Testing Checklist

- [ ] Run migrations successfully
- [ ] Create a test game with two teams
- [ ] Ensure teams have players with jersey numbers
- [ ] Start live tracking from admin panel
- [ ] Add goals and suspensions
- [ ] Verify auto-save is working (check database)
- [ ] Open viewer page and see live updates
- [ ] Finalize match
- [ ] Check player stats updated in database
- [ ] Check team standings updated in database
- [ ] Check league rankings are correct
- [ ] Verify API endpoints return correct data

## Troubleshooting

### Migration Errors
```bash
# If migrations fail, rollback and try again
php artisan migrate:rollback
php artisan migrate
```

### CORS Issues
Make sure `config/cors.php` allows your frontend URL:
```php
'allowed_origins' => ['http://localhost:3000'],
```

### JSON Column Issues
If using older MySQL version, ensure it supports JSON columns:
```bash
# Check MySQL version
mysql --version
# Should be 5.7.8 or higher
```

### Player Stats Not Updating
Check logs:
```bash
tail -f storage/logs/laravel.log
```

## Production Deployment

1. **Environment Variables**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Run Migrations**
   ```bash
   php artisan migrate --force
   ```

3. **Optimize**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Set Up Queue Worker** (optional, for better performance)
   ```bash
   php artisan queue:work
   ```

## Security Recommendations

1. **Add Authentication Middleware**
   ```php
   // In routes/api.php
   Route::middleware('auth:sanctum')->group(function () {
       Route::post('games/{id}/live-update', [LiveMatchController::class, 'updateLiveMatch']);
       Route::post('games/{id}/finalize', [LiveMatchController::class, 'finalizeMatch']);
   });
   ```

2. **Rate Limiting**
   ```php
   // In app/Http/Kernel.php
   'api' => [
       'throttle:60,1', // 60 requests per minute
       \Illuminate\Routing\Middleware\SubstituteBindings::class,
   ],
   ```

3. **Validate Input**
   All controllers already include basic validation, but you can add more:
   ```php
   $request->validate([
       'homeScore' => 'required|integer|min:0|max:100',
       'awayScore' => 'required|integer|min:0|max:100',
       // ... more validation rules
   ]);
   ```

## Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check database connection: `php artisan tinker` then `DB::connection()->getPdo();`
3. Verify migrations ran: `php artisan migrate:status`
4. Test API endpoints with curl or Postman

## Next Steps

1. Run migrations
2. Test with sample data
3. Configure CORS
4. Add authentication
5. Deploy to production

Your Laravel backend is now ready for live match tracking! 🎉
