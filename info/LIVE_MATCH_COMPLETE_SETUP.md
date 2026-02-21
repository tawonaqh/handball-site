# Complete Live Match Tracking System - Setup Guide

## 🎯 Overview

A complete real-time handball match tracking system with Laravel backend and Next.js frontend.

## 📁 What Was Created

### Frontend (handball-frontend/)
```
✅ src/components/LiveMatchTracker.js       - Admin tracking interface
✅ src/components/LiveMatchViewer.js        - Public viewing interface
✅ src/app/admin/games/[id]/live/page.js   - Admin page
✅ src/app/(public)/fixtures/[id]/live/page.js - Public page
✅ src/lib/liveMatchService.js              - API service
✅ Updated: src/app/admin/games/page.js     - Added live button
✅ Updated: src/app/(public)/fixtures/page.js - Added watch live button
```

### Backend (handball-website/)
```
✅ database/migrations/
   - 2025_02_21_000001_add_live_tracking_fields_to_games_table.php
   - 2025_02_21_000002_create_player_stats_table.php
   - 2025_02_21_000003_create_team_standings_table.php
   - 2025_02_21_000004_add_jersey_number_to_players_table.php

✅ app/Models/
   - PlayerStat.php (new)
   - TeamStanding.php (new)
   - Updated: Game.php, Player.php, Team.php

✅ app/Http/Controllers/Api/
   - LiveMatchController.php (new)
   - Updated: GameController.php

✅ routes/api.php (updated with live match routes)
✅ setup-live-tracking.bat (Windows setup script)
✅ setup-live-tracking.sh (Linux/Mac setup script)
✅ LARAVEL_SETUP_GUIDE.md (detailed Laravel guide)
```

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Laravel Backend

```bash
# Navigate to Laravel directory
cd handball-website

# Run the setup script
# Windows:
setup-live-tracking.bat

# Linux/Mac:
chmod +x setup-live-tracking.sh
./setup-live-tracking.sh

# Or manually:
php artisan migrate
```

### Step 2: Start Laravel Server

```bash
# In handball-website directory
php artisan serve
```

Server will run on `http://localhost:8000`

### Step 3: Start Next.js Frontend

```bash
# In handball-frontend directory
cd ../handball-frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Test the System

1. Open `http://localhost:3000/admin/games`
2. Click the 🔴 (Play) icon on any game
3. Start tracking the match!

## 📊 Features

### Admin Side
- ✅ Real-time scoreboard with timer
- ✅ Player goal tracking (+/-)
- ✅ 2-minute suspension management
- ✅ Automatic red cards (3 fouls)
- ✅ Player substitutions
- ✅ Match event log
- ✅ Auto-save every 5 seconds
- ✅ Manual save & finalize
- ✅ Connection status

### Viewer Side
- ✅ Real-time match viewing
- ✅ Live scoreboard
- ✅ Player statistics
- ✅ Active suspensions
- ✅ Match events
- ✅ Auto-refresh every 2 seconds

### Backend Processing
- ✅ Auto-update player stats
- ✅ Auto-update team standings
- ✅ Auto-calculate rankings
- ✅ Point system (Win: 2, Draw: 1, Loss: 0)
- ✅ Goal difference tracking

## 🔌 API Endpoints

### Public
```
GET  /api/games/{id}/live              - Get live match data
GET  /api/leagues/{id}/standings       - Get league standings
GET  /api/rankings/players             - Get player rankings
```

### Admin
```
POST /api/games/{id}/live-update       - Update match state
POST /api/games/{id}/finalize          - Finalize match
```

## 🗄️ Database Schema

### New Tables
- `player_stats` - Player statistics per season/league
- `team_standings` - Team standings per season/league

### Updated Tables
- `games` - Added: live_data, duration, completed_at, venue, round, match_time
- `players` - Added: jersey_number

## 🎮 How to Use

### For Admins

1. **Start Live Tracking**
   - Go to `/admin/games`
   - Click 🔴 icon on a game
   - You'll see the live tracking interface

2. **During Match**
   - Click ▶️ to start timer
   - Click + on player goals to score
   - Click "2'" for 2-minute suspension
   - Click ↔️ for substitutions
   - Match auto-saves every 5 seconds

3. **Finalize Match**
   - Click ⏸️ to pause
   - Click "Finalize Match"
   - Confirm action
   - System updates all stats automatically

### For Viewers

1. **Watch Live**
   - Go to `/fixtures`
   - Click "Watch Live" on live matches
   - View real-time updates

## 🔧 Configuration

### Environment Variables

**Laravel (.env)**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=handball_db
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

**Next.js (.env.local)**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 📝 Testing Checklist

- [ ] Laravel server running
- [ ] Next.js server running
- [ ] Database migrations completed
- [ ] Players have jersey numbers
- [ ] Can start live tracking
- [ ] Goals update correctly
- [ ] Suspensions work
- [ ] Substitutions work
- [ ] Auto-save working
- [ ] Viewer page updates
- [ ] Finalize updates stats
- [ ] League standings correct
- [ ] Player rankings correct

## 🐛 Troubleshooting

### "Failed to fetch live match data"
**Solution**: Check Laravel server is running on port 8000

### "Migration failed"
**Solution**: Check database connection in `.env`

### "CORS error"
**Solution**: Update `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
```

### "Players not loading"
**Solution**: Ensure teams have players assigned

### "Jersey numbers missing"
**Solution**: Run the setup script or manually assign:
```bash
php artisan tinker
```
```php
$teams = App\Models\Team::with('players')->get();
foreach ($teams as $team) {
    $number = 1;
    foreach ($team->players as $player) {
        $player->jersey_number = $number++;
        $player->save();
    }
}
```

## 📚 Documentation

- **Laravel Setup**: `handball-website/LARAVEL_SETUP_GUIDE.md`
- **API Documentation**: `handball-frontend/LIVE_MATCH_API.md`
- **Feature Guide**: `handball-frontend/LIVE_MATCH_TRACKING.md`
- **Quick Start**: `handball-frontend/QUICK_START_LIVE_TRACKING.md`

## 🔒 Security (Production)

1. **Add Authentication**
   ```php
   Route::middleware('auth:sanctum')->group(function () {
       Route::post('games/{id}/live-update', ...);
       Route::post('games/{id}/finalize', ...);
   });
   ```

2. **Enable Rate Limiting**
   ```php
   'api' => ['throttle:60,1'],
   ```

3. **Configure CORS**
   ```php
   'allowed_origins' => [env('FRONTEND_URL')],
   ```

## 🚀 Production Deployment

### Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

### Next.js
```bash
npm run build
npm start
```

## 📊 Point System

- **Win**: 2 points
- **Draw**: 1 point  
- **Loss**: 0 points

**Rankings by**:
1. Points (descending)
2. Goal difference (descending)
3. Goals scored (descending)

## 🎯 What Happens When You Finalize

1. ✅ Game status → "completed"
2. ✅ Player stats updated (goals, suspensions, red cards)
3. ✅ Team standings updated (wins/draws/losses, goals, points)
4. ✅ League rankings recalculated
5. ✅ Points awarded based on result

## 💡 Tips

- Assign jersey numbers to all players before starting
- Test with a sample match first
- Keep Laravel logs open during testing: `tail -f storage/logs/laravel.log`
- Use browser dev tools to check API calls
- Finalize matches only when complete (can't undo!)

## 🆘 Support

If you encounter issues:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for errors
3. Verify database connection
4. Test API endpoints with curl/Postman
5. Review documentation files

## ✅ Success Criteria

Your system is working when:
- ✅ Admin can track live matches
- ✅ Viewers see real-time updates
- ✅ Stats update after finalize
- ✅ Rankings recalculate correctly
- ✅ No errors in logs
- ✅ Mobile-friendly interface

## 🎉 You're Done!

Your complete live match tracking system is ready to use!

**Quick Commands**:
```bash
# Start Laravel
cd handball-website && php artisan serve

# Start Next.js (new terminal)
cd handball-frontend && npm run dev

# Open browser
http://localhost:3000/admin/games
```

Happy tracking! 🏐
