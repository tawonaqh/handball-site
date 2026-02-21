# Live Match Tracking System

A comprehensive real-time handball match tracking system with automatic statistics, rankings, and league standings updates.

## Features

### Admin Side (Match Tracker)
- ✅ Real-time scoreboard with timer
- ✅ Player goal tracking with +/- controls
- ✅ 2-minute suspension management with countdown
- ✅ Red card tracking (3 suspensions = automatic red card)
- ✅ Player substitution system
- ✅ Match event log (goals, fouls, substitutions)
- ✅ Auto-save every 5 seconds during live match
- ✅ Manual save and finalize options
- ✅ Connection status indicator
- ✅ Pause/Resume match timer
- ✅ Scoring disabled when match is paused

### Viewer Side (Public)
- ✅ Real-time match viewing (updates every 2 seconds)
- ✅ Live scoreboard display
- ✅ Player statistics view
- ✅ Active suspensions display
- ✅ Match event log
- ✅ Connection status
- ✅ Live indicator when match is in progress

### Backend Integration
- ✅ Auto-update player statistics
- ✅ Auto-update team standings
- ✅ Auto-calculate league rankings
- ✅ Point system (Win: 2pts, Draw: 1pt, Loss: 0pts)
- ✅ Goal difference tracking
- ✅ Player performance metrics

## File Structure

```
handball-frontend/
├── src/
│   ├── components/
│   │   ├── LiveMatchTracker.js      # Admin match tracking component
│   │   └── LiveMatchViewer.js       # Public viewing component
│   ├── app/
│   │   ├── admin/
│   │   │   └── games/
│   │   │       └── [id]/
│   │   │           └── live/
│   │   │               └── page.js  # Admin live tracking page
│   │   └── (public)/
│   │       └── fixtures/
│   │           └── [id]/
│   │               └── live/
│   │                   └── page.js  # Public viewing page
│   └── lib/
│       └── liveMatchService.js      # API service layer
├── LIVE_MATCH_API.md                # API documentation
├── BACKEND_IMPLEMENTATION.md        # Backend implementation guide
└── LIVE_MATCH_TRACKING.md          # This file
```

## Usage

### For Admins

1. **Start Live Tracking**
   - Navigate to `/admin/games`
   - Click the "Play" icon on a scheduled or live game
   - You'll be redirected to `/admin/games/{id}/live`

2. **During Match**
   - Click Play/Pause to control the timer
   - Click +/- on player goals to update scores
   - Click "2'" button to add 2-minute suspension
   - Click substitution icon to swap players
   - Match auto-saves every 5 seconds
   - Click "Save Now" for manual save

3. **Finalize Match**
   - Pause the match timer
   - Click "Finalize Match"
   - Confirm the action
   - System will:
     - Update player statistics
     - Update team standings
     - Recalculate league rankings
     - Award points based on result

### For Viewers

1. **Watch Live Match**
   - Navigate to `/fixtures/{id}/live`
   - View updates in real-time (2-second polling)
   - See live scores, player stats, and events
   - No interaction needed - just watch!

## API Endpoints

### Public Endpoints

```
GET /api/games/{gameId}/live
```
Returns current live match state for viewers.

### Admin Endpoints (Require Authentication)

```
POST /api/games/{gameId}/live-update
```
Updates live match state (called every 5 seconds).

```
POST /api/games/{gameId}/finalize
```
Finalizes match and triggers all stat updates.

See `LIVE_MATCH_API.md` for detailed API documentation.

## Backend Setup

### Required Database Tables

1. **games** - Match records
2. **player_stats** - Player statistics per season
3. **team_standings** - Team standings per league/season
4. **player_rankings** - Player rankings by category

See `BACKEND_IMPLEMENTATION.md` for:
- Complete database schema
- Django REST Framework implementation
- FastAPI implementation
- SQL queries for rankings calculation

## Point System

### Team Points
- **Win**: 2 points
- **Draw**: 1 point
- **Loss**: 0 points

### Ranking Calculation
Teams are ranked by:
1. Total points (primary)
2. Goal difference (secondary)
3. Goals scored (tertiary)

### Player Statistics Tracked
- Total goals
- Games played
- 2-minute suspensions
- Red cards
- Goals per game average

## Real-time Updates

### Current Implementation: Polling
- Viewer polls every 2 seconds
- Admin auto-saves every 5 seconds
- Simple, reliable, works with any backend

### Optional: WebSocket
For better performance at scale:
- Real-time push updates
- Lower server load
- Instant updates
- See `liveMatchService.js` for WebSocket class

## Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080  # Optional for WebSocket
```

## Security

### Admin Endpoints
- Require JWT authentication
- Validate user permissions
- Rate limit to prevent abuse

### Public Endpoints
- Read-only access
- Rate limit for DDoS protection
- CORS configured for frontend domain

## Testing

### Test Admin Flow
1. Start a match at `/admin/games/{id}/live`
2. Add some goals and suspensions
3. Make substitutions
4. Finalize the match
5. Check `/leagues/{leagueId}/standings` for updated standings
6. Check `/rankings/players` for updated player stats

### Test Viewer Flow
1. Open `/fixtures/{id}/live` in another browser/tab
2. Make changes in admin view
3. Watch updates appear in viewer (within 2 seconds)

## Troubleshooting

### Match not saving
- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token
- Verify CORS configuration

### Viewer not updating
- Check connection status indicator
- Verify API endpoint returns data
- Check browser console for errors
- Try manual refresh button

### Rankings not updating
- Verify finalize endpoint was called
- Check backend logs for errors
- Verify database transactions completed
- Check league/season IDs are correct

## Future Enhancements

### Potential Features
- [ ] Video streaming integration
- [ ] Live chat for viewers
- [ ] Match highlights/clips
- [ ] Advanced statistics (possession, shots, etc.)
- [ ] Mobile app for live tracking
- [ ] Push notifications for goals
- [ ] Multi-language support
- [ ] Export match reports (PDF)
- [ ] Historical match replay
- [ ] Referee management
- [ ] Timeout tracking
- [ ] Team formation visualization

### Performance Optimizations
- [ ] WebSocket implementation
- [ ] Redis caching for live data
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Lazy loading for match history

## Support

For issues or questions:
1. Check API documentation in `LIVE_MATCH_API.md`
2. Review backend implementation in `BACKEND_IMPLEMENTATION.md`
3. Check browser console for errors
4. Verify backend is running and accessible

## License

Part of the Handball Management System.
