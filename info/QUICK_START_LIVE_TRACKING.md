# Quick Start: Live Match Tracking Integration

Get your live match tracking system up and running in minutes!

## Step 1: Frontend Setup (Already Done! ✅)

The following files have been created:

```
✅ src/components/LiveMatchTracker.js       - Admin tracking interface
✅ src/components/LiveMatchViewer.js        - Public viewing interface
✅ src/app/admin/games/[id]/live/page.js   - Admin page
✅ src/app/(public)/fixtures/[id]/live/page.js - Public page
✅ src/lib/liveMatchService.js              - API service
✅ src/app/admin/games/page.js              - Updated with live button
```

## Step 2: Backend Setup (You Need to Do This)

### Option A: Quick Mock Backend (For Testing)

Create a simple mock server to test the frontend:

```javascript
// mock-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let liveMatches = {};

// Get live match data
app.get('/api/games/:id/live', (req, res) => {
  const gameId = req.params.id;
  res.json(liveMatches[gameId] || {
    gameId: parseInt(gameId),
    time: 0,
    isRunning: false,
    teamAName: "Team A",
    teamBName: "Team B",
    scoreA: 0,
    scoreB: 0,
    playersA: [],
    playersB: [],
    onCourtA: [],
    onCourtB: [],
    activeFouls: [],
    matchLog: []
  });
});

// Update live match
app.post('/api/games/:id/live-update', (req, res) => {
  const gameId = req.params.id;
  liveMatches[gameId] = req.body;
  res.json({ success: true, message: 'Match state saved' });
});

// Finalize match
app.post('/api/games/:id/finalize', (req, res) => {
  console.log('Finalizing match:', req.body);
  res.json({
    success: true,
    message: 'Match finalized',
    updates: {
      gameStatus: 'completed',
      playerStatsUpdated: 14,
      teamStandingsUpdated: 2,
      leagueRankingsUpdated: true,
      pointsAwarded: { homeTeam: 2, awayTeam: 0 }
    }
  });
});

app.listen(8000, () => {
  console.log('Mock server running on http://localhost:8000');
});
```

Run it:
```bash
npm install express cors
node mock-server.js
```

### Option B: Full Backend Implementation

Choose your framework:

#### Django REST Framework
See `BACKEND_IMPLEMENTATION.md` - Django section

#### FastAPI (Python)
See `BACKEND_IMPLEMENTATION.md` - FastAPI section

#### Node.js/Express
```javascript
// See BACKEND_IMPLEMENTATION.md for complete implementation
```

## Step 3: Database Setup

### Required Tables

```sql
-- Games table
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  league_id INT,
  home_team_id INT,
  away_team_id INT,
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled',
  live_data JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player stats table
CREATE TABLE player_stats (
  id SERIAL PRIMARY KEY,
  player_id INT,
  season_id INT,
  games_played INT DEFAULT 0,
  total_goals INT DEFAULT 0,
  total_suspensions INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  UNIQUE(player_id, season_id)
);

-- Team standings table
CREATE TABLE team_standings (
  id SERIAL PRIMARY KEY,
  team_id INT,
  league_id INT,
  season_id INT,
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_difference INT DEFAULT 0,
  points INT DEFAULT 0,
  rank INT,
  UNIQUE(team_id, league_id, season_id)
);
```

## Step 4: Test the System

### 1. Start Backend
```bash
# If using mock server
node mock-server.js

# If using Django
python manage.py runserver

# If using FastAPI
uvicorn main:app --reload
```

### 2. Start Frontend
```bash
cd handball-frontend
npm run dev
```

### 3. Test Admin Flow

1. Go to `http://localhost:3000/admin/games`
2. Click the Play icon (🔴) on any game
3. You'll see the live tracking interface
4. Click Play to start the timer
5. Click + on player goals to add scores
6. Click "2'" to add suspensions
7. Watch auto-save indicator
8. Click "Finalize Match" when done

### 4. Test Viewer Flow

1. Open `http://localhost:3000/fixtures/{gameId}/live` in another tab
2. Make changes in admin view
3. Watch updates appear in viewer (2-second delay)

## Step 5: Connect to Real Data

### Update Initial Data Loading

Edit `src/app/admin/games/[id]/live/page.js`:

```javascript
// Replace the initialData transformation with your actual data structure
const initialData = {
  time: gameData.live_data?.time || 0,
  teamAName: gameData.home_team?.name || "Home Team",
  teamBName: gameData.away_team?.name || "Away Team",
  
  // Map your actual players data
  playersA: gameData.home_team?.players?.map((p, i) => ({
    id: p.id,
    name: p.name,
    number: p.jersey_number || (i + 1).toString(),
    goals: 0,
    suspensions: 0,
    isRedCarded: false
  })) || [],
  
  playersB: gameData.away_team?.players?.map((p, i) => ({
    id: p.id,
    name: p.name,
    number: p.jersey_number || (i + 1).toString(),
    goals: 0,
    suspensions: 0,
    isRedCarded: false
  })) || [],
  
  // Set starting lineup (first 7 players)
  onCourtA: gameData.home_team?.players?.slice(0, 7).map(p => p.id) || [],
  onCourtB: gameData.away_team?.players?.slice(0, 7).map(p => p.id) || [],
  
  activeFouls: gameData.live_data?.activeFouls || [],
  matchLog: gameData.live_data?.matchLog || []
};
```

## Step 6: Add Authentication (Important!)

### Protect Admin Routes

```javascript
// middleware.js (already exists, update it)
export function middleware(request) {
  const token = request.cookies.get('auth_token');
  
  if (request.nextUrl.pathname.startsWith('/admin/games') && 
      request.nextUrl.pathname.includes('/live')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}
```

### Add Token to API Calls

```javascript
// In LiveMatchTracker.js, update saveMatchState:
const token = localStorage.getItem('auth_token'); // or however you store it

const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}/live-update`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Add this
  },
  body: JSON.stringify(matchState)
});
```

## Step 7: Production Checklist

Before going live:

- [ ] Backend API is deployed and accessible
- [ ] Database tables are created
- [ ] Authentication is implemented
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Error handling is tested
- [ ] Rate limiting is configured
- [ ] Backup system is in place
- [ ] Monitoring/logging is set up
- [ ] Test with real match data
- [ ] Test on mobile devices
- [ ] Test with slow internet connection

## Common Issues & Solutions

### Issue: "Failed to fetch live match data"
**Solution:** Check that backend is running and CORS is configured

### Issue: "Match not saving"
**Solution:** Check authentication token and API endpoint

### Issue: "Viewer not updating"
**Solution:** Verify polling interval and API response format

### Issue: "Rankings not updating after finalize"
**Solution:** Check backend finalize endpoint implementation

## Next Steps

1. ✅ Test with mock data
2. ✅ Connect to real backend
3. ✅ Load actual player rosters
4. ✅ Test finalize flow
5. ✅ Verify rankings update
6. ✅ Add authentication
7. ✅ Deploy to production

## Need Help?

- Check `LIVE_MATCH_API.md` for API details
- Check `BACKEND_IMPLEMENTATION.md` for backend code
- Check `LIVE_MATCH_TRACKING.md` for feature documentation
- Check browser console for errors
- Check backend logs for issues

## Quick Commands

```bash
# Install dependencies (if needed)
npm install framer-motion lucide-react

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

That's it! You now have a fully functional live match tracking system. 🎉
