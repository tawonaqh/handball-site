# Live Match Tracking API Documentation

This document outlines the backend API endpoints needed for the live match tracking system.

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Get Live Match Data (Public)
**GET** `/games/{gameId}/live`

Returns current live match state for viewers.

**Response:**
```json
{
  "gameId": 123,
  "time": 1850,
  "isRunning": true,
  "teamAName": "Team North",
  "teamBName": "Team South",
  "scoreA": 25,
  "scoreB": 23,
  "playersA": [
    {
      "id": 100,
      "name": "Player 1",
      "number": "1",
      "goals": 5,
      "suspensions": 1,
      "isRedCarded": false
    }
  ],
  "playersB": [...],
  "onCourtA": [100, 101, 102, 103, 104, 105, 106],
  "onCourtB": [200, 201, 202, 203, 204, 205, 206],
  "activeFouls": [
    {
      "id": 1234567890,
      "playerId": 102,
      "team": "A",
      "playerName": "Player 3",
      "playerNumber": "3",
      "remaining": 85
    }
  ],
  "matchLog": [
    {
      "id": 1234567891,
      "time": "30:50",
      "player": "Player 1",
      "team": "Team North",
      "type": "GOAL"
    }
  ],
  "timestamp": "2026-02-21T10:30:45Z"
}
```

---

### 2. Update Live Match State (Admin)
**POST** `/games/{gameId}/live-update`

Admin endpoint to save current match state. Called every 5 seconds during live match.

**Request Body:**
```json
{
  "gameId": 123,
  "time": 1850,
  "isRunning": true,
  "teamAName": "Team North",
  "teamBName": "Team South",
  "playersA": [...],
  "playersB": [...],
  "onCourtA": [100, 101, 102, 103, 104, 105, 106],
  "onCourtB": [200, 201, 202, 203, 204, 205, 206],
  "activeFouls": [...],
  "matchLog": [...],
  "scoreA": 25,
  "scoreB": 23,
  "timestamp": "2026-02-21T10:30:45Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Match state saved",
  "timestamp": "2026-02-21T10:30:45Z"
}
```

---

### 3. Finalize Match (Admin)
**POST** `/games/{gameId}/finalize`

Finalizes the match and triggers all stat updates, rankings calculations, and league standings.

**Request Body:**
```json
{
  "gameId": 123,
  "homeScore": 25,
  "awayScore": 23,
  "playersA": [
    {
      "playerId": 100,
      "goals": 5,
      "suspensions": 1,
      "redCard": false
    }
  ],
  "playersB": [...],
  "matchLog": [...],
  "duration": 3600
}
```

**Response:**
```json
{
  "success": true,
  "message": "Match finalized successfully",
  "updates": {
    "gameStatus": "completed",
    "playerStatsUpdated": 28,
    "teamStandingsUpdated": 2,
    "leagueRankingsUpdated": true,
    "pointsAwarded": {
      "homeTeam": 2,
      "awayTeam": 0
    }
  }
}
```

---

## Backend Processing Logic

### When `/finalize` is called:

#### 1. Update Game Record
```sql
UPDATE games 
SET 
  status = 'completed',
  home_score = {homeScore},
  away_score = {awayScore},
  duration = {duration},
  completed_at = NOW()
WHERE id = {gameId};
```

#### 2. Update Player Statistics
For each player in the match:
```sql
UPDATE player_stats 
SET 
  total_goals = total_goals + {goals},
  total_suspensions = total_suspensions + {suspensions},
  red_cards = red_cards + {redCard ? 1 : 0},
  games_played = games_played + 1
WHERE player_id = {playerId} AND season_id = {currentSeason};
```

#### 3. Calculate and Award Points
Based on handball scoring system (customize as needed):
- Win: 2 points
- Draw: 1 point
- Loss: 0 points

```sql
-- Winner gets 2 points
UPDATE team_standings 
SET 
  points = points + 2,
  wins = wins + 1,
  goals_for = goals_for + {homeScore},
  goals_against = goals_against + {awayScore},
  goal_difference = goal_difference + ({homeScore} - {awayScore}),
  games_played = games_played + 1
WHERE team_id = {winnerTeamId} AND league_id = {leagueId};

-- Loser gets 0 points
UPDATE team_standings 
SET 
  losses = losses + 1,
  goals_for = goals_for + {awayScore},
  goals_against = goals_against + {homeScore},
  goal_difference = goal_difference + ({awayScore} - {homeScore}),
  games_played = games_played + 1
WHERE team_id = {loserTeamId} AND league_id = {leagueId};
```

#### 4. Update League Rankings
Recalculate rankings based on:
1. Points (primary)
2. Goal difference (secondary)
3. Goals scored (tertiary)

```sql
-- Update rankings
WITH ranked_teams AS (
  SELECT 
    team_id,
    ROW_NUMBER() OVER (
      ORDER BY 
        points DESC, 
        goal_difference DESC, 
        goals_for DESC
    ) as new_rank
  FROM team_standings
  WHERE league_id = {leagueId}
)
UPDATE team_standings ts
SET rank = rt.new_rank
FROM ranked_teams rt
WHERE ts.team_id = rt.team_id AND ts.league_id = {leagueId};
```

#### 5. Update Player Rankings
Calculate top scorers, most suspensions, etc.

```sql
-- Top scorers
WITH ranked_players AS (
  SELECT 
    player_id,
    ROW_NUMBER() OVER (
      ORDER BY total_goals DESC, games_played ASC
    ) as rank
  FROM player_stats
  WHERE season_id = {currentSeason}
)
UPDATE player_rankings pr
SET rank = rp.rank
FROM ranked_players rp
WHERE pr.player_id = rp.player_id AND pr.season_id = {currentSeason};
```

---

## Database Schema Suggestions

### games table
```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  league_id INT REFERENCES leagues(id),
  home_team_id INT REFERENCES teams(id),
  away_team_id INT REFERENCES teams(id),
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, postponed, cancelled
  match_date DATE,
  match_time TIME,
  venue VARCHAR(255),
  round INT,
  duration INT, -- in seconds
  live_data JSONB, -- stores live match state
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### player_stats table
```sql
CREATE TABLE player_stats (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  team_id INT REFERENCES teams(id),
  season_id INT REFERENCES seasons(id),
  games_played INT DEFAULT 0,
  total_goals INT DEFAULT 0,
  total_suspensions INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, season_id)
);
```

### team_standings table
```sql
CREATE TABLE team_standings (
  id SERIAL PRIMARY KEY,
  team_id INT REFERENCES teams(id),
  league_id INT REFERENCES leagues(id),
  season_id INT REFERENCES seasons(id),
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_difference INT DEFAULT 0,
  points INT DEFAULT 0,
  rank INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, league_id, season_id)
);
```

### player_rankings table
```sql
CREATE TABLE player_rankings (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  season_id INT REFERENCES seasons(id),
  category VARCHAR(50), -- 'top_scorer', 'most_suspensions', etc.
  rank INT,
  value INT, -- goals, suspensions, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Real-time Updates Options

### Option 1: Polling (Simpler)
Frontend polls `/games/{gameId}/live` every 2 seconds.

**Pros:**
- Simple to implement
- No special server setup
- Works with any backend

**Cons:**
- Higher server load
- Slight delay (up to 2 seconds)

### Option 2: WebSockets (Better for scale)
Use WebSocket connection for real-time push updates.

**Implementation:**
```javascript
// Backend (Node.js example)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const gameId = req.url.split('/').pop();
  
  ws.on('message', (message) => {
    // Broadcast to all clients watching this game
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(matchState));
      }
    });
  });
});
```

**Frontend:**
```javascript
const ws = new WebSocket(`ws://localhost:8080/games/${gameId}`);
ws.onmessage = (event) => {
  const matchData = JSON.parse(event.data);
  setMatchData(matchData);
};
```

---

## Security Considerations

1. **Authentication**: Admin endpoints should require JWT token
2. **Rate Limiting**: Limit live-update calls to prevent abuse
3. **Validation**: Validate all incoming data
4. **CORS**: Configure properly for frontend domain
5. **WebSocket Auth**: Authenticate WebSocket connections

---

## Testing Endpoints

Use these curl commands to test:

```bash
# Get live match data
curl http://localhost:8000/api/games/123/live

# Update match state (admin)
curl -X POST http://localhost:8000/api/games/123/live-update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @match_state.json

# Finalize match (admin)
curl -X POST http://localhost:8000/api/games/123/finalize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @final_data.json
```
