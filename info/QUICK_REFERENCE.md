# 🚀 Quick Reference Card

## Start System (Copy & Paste)

### Terminal 1 - Laravel Backend
```bash
cd handball-website
php artisan migrate
php artisan serve
```

### Terminal 2 - Next.js Frontend
```bash
cd handball-frontend
npm run dev
```

### Open Browser
```
http://localhost:3000/admin/games
```

---

## 🎯 URLs

| Purpose | URL |
|---------|-----|
| Admin Games | `http://localhost:3000/admin/games` |
| Live Tracking | `http://localhost:3000/admin/games/{id}/live` |
| Public Fixtures | `http://localhost:3000/fixtures` |
| Watch Live | `http://localhost:3000/fixtures/{id}/live` |
| API Base | `http://localhost:8000/api` |

---

## 🔌 API Endpoints

### Public
```bash
# Get live match
curl http://localhost:8000/api/games/1/live

# Get standings
curl http://localhost:8000/api/leagues/1/standings

# Get rankings
curl http://localhost:8000/api/rankings/players?season=2025
```

### Admin
```bash
# Update live match
curl -X POST http://localhost:8000/api/games/1/live-update \
  -H "Content-Type: application/json" \
  -d '{"gameId":1,"time":1800,"scoreA":25,"scoreB":23}'

# Finalize match
curl -X POST http://localhost:8000/api/games/1/finalize \
  -H "Content-Type: application/json" \
  -d '{"gameId":1,"homeScore":25,"awayScore":23}'
```

---

## 📁 Key Files

### Backend
```
handball-website/
├── app/Http/Controllers/Api/LiveMatchController.php
├── app/Models/PlayerStat.php
├── app/Models/TeamStanding.php
├── routes/api.php
└── database/migrations/2025_02_21_*.php
```

### Frontend
```
handball-frontend/
├── src/components/LiveMatchTracker.js
├── src/components/LiveMatchViewer.js
├── src/app/admin/games/[id]/live/page.js
└── src/app/(public)/fixtures/[id]/live/page.js
```

---

## 🗄️ Database Tables

### New
- `player_stats` - Player statistics
- `team_standings` - Team standings

### Updated
- `games` - Added live tracking fields
- `players` - Added jersey_number

---

## 🎮 Admin Controls

| Action | Button/Control |
|--------|---------------|
| Start Timer | ▶️ Play button |
| Pause Timer | ⏸️ Pause button |
| Reset Match | 🔄 Reset button |
| Add Goal | + button on player |
| Remove Goal | - button on player |
| Add Suspension | "2'" button |
| Substitute | ↔️ button |
| Save Now | "Save Now" button |
| Finalize | "Finalize Match" button |

---

## 📊 Point System

| Result | Points |
|--------|--------|
| Win | 2 |
| Draw | 1 |
| Loss | 0 |

**Rankings by**: Points → Goal Diff → Goals For

---

## ⚡ Features

### Admin
- ✅ Real-time timer
- ✅ Goal tracking
- ✅ 2-min suspensions
- ✅ Auto red cards (3 fouls)
- ✅ Substitutions
- ✅ Auto-save (5s)
- ✅ Match log

### Viewer
- ✅ Live scoreboard
- ✅ Player stats
- ✅ Active fouls
- ✅ Match events
- ✅ Auto-refresh (2s)

### Backend
- ✅ Player stats
- ✅ Team standings
- ✅ League rankings
- ✅ Point awards

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration failed | Check `.env` database config |
| CORS error | Update `config/cors.php` |
| Players not loading | Assign players to teams |
| Jersey numbers missing | Run setup script |
| Connection failed | Check Laravel server running |

---

## 📝 Quick Commands

```bash
# Run migrations
php artisan migrate

# Check migration status
php artisan migrate:status

# Rollback migrations
php artisan migrate:rollback

# Clear cache
php artisan cache:clear
php artisan config:clear

# View logs
tail -f storage/logs/laravel.log

# Laravel tinker
php artisan tinker
```

---

## 🔧 Configuration

### Laravel (.env)
```env
DB_DATABASE=handball_db
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:3000
```

### Next.js (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_COMPLETE.md` | Complete overview |
| `LIVE_MATCH_COMPLETE_SETUP.md` | Setup guide |
| `handball-website/LARAVEL_SETUP_GUIDE.md` | Laravel details |
| `handball-frontend/LIVE_MATCH_API.md` | API docs |

---

## ✅ Test Checklist

- [ ] Migrations ran
- [ ] Servers running
- [ ] Can access admin
- [ ] Can start tracking
- [ ] Goals work
- [ ] Fouls work
- [ ] Subs work
- [ ] Auto-save works
- [ ] Viewer updates
- [ ] Finalize works
- [ ] Stats update

---

## 🎯 Workflow

1. **Admin** → Start live tracking
2. **System** → Auto-saves every 5s
3. **Viewers** → Watch in real-time
4. **Admin** → Finalize match
5. **System** → Updates all stats
6. **Done** → Rankings updated

---

## 💡 Tips

- Test with sample data first
- Keep logs open during testing
- Don't finalize until complete
- Backup database before production
- Assign jersey numbers to all players

---

## 🆘 Help

1. Check documentation files
2. Check Laravel logs
3. Check browser console
4. Test API with curl
5. Verify database connection

---

**Quick Start**: Run migrations → Start servers → Open admin → Click live button → Start tracking!

**Status**: ✅ Ready to use

**Support**: See documentation files for detailed help
