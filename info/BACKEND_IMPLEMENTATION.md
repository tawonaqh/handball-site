# Backend Implementation Guide

This guide provides sample implementations for the live match tracking endpoints.

## Option 1: Django REST Framework

### models.py

```python
from django.db import models
from django.contrib.postgres.fields import JSONField

class Game(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('completed', 'Completed'),
        ('postponed', 'Postponed'),
        ('cancelled', 'Cancelled'),
    ]
    
    league = models.ForeignKey('League', on_delete=models.CASCADE)
    home_team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='home_games')
    away_team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='away_games')
    home_score = models.IntegerField(default=0)
    away_score = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    match_date = models.DateField()
    match_time = models.TimeField(null=True, blank=True)
    venue = models.CharField(max_length=255, null=True, blank=True)
    round = models.IntegerField(default=1)
    duration = models.IntegerField(null=True, blank=True)  # in seconds
    live_data = models.JSONField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PlayerStats(models.Model):
    player = models.ForeignKey('Player', on_delete=models.CASCADE)
    team = models.ForeignKey('Team', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    total_goals = models.IntegerField(default=0)
    total_suspensions = models.IntegerField(default=0)
    red_cards = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['player', 'season']

class TeamStanding(models.Model):
    team = models.ForeignKey('Team', on_delete=models.CASCADE)
    league = models.ForeignKey('League', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    goals_for = models.IntegerField(default=0)
    goals_against = models.IntegerField(default=0)
    goal_difference = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['team', 'league', 'season']
        ordering = ['-points', '-goal_difference', '-goals_for']
```

### views.py

```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Game, PlayerStats, TeamStanding
from .serializers import GameSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_live_match(request, game_id):
    """
    Public endpoint to get live match data
    """
    game = get_object_or_404(Game, id=game_id)
    
    if not game.live_data:
        return Response({
            'error': 'No live data available for this game'
        }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(game.live_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_live_match(request, game_id):
    """
    Admin endpoint to update live match state
    """
    game = get_object_or_404(Game, id=game_id)
    
    # Update live data
    game.live_data = request.data
    game.status = 'live'
    game.save()
    
    return Response({
        'success': True,
        'message': 'Match state saved',
        'timestamp': timezone.now().isoformat()
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finalize_match(request, game_id):
    """
    Admin endpoint to finalize match and update all stats
    """
    game = get_object_or_404(Game, id=game_id)
    data = request.data
    
    try:
        with transaction.atomic():
            # 1. Update game record
            game.status = 'completed'
            game.home_score = data['homeScore']
            game.away_score = data['awayScore']
            game.duration = data.get('duration', 0)
            game.completed_at = timezone.now()
            game.save()
            
            # 2. Update player statistics
            player_stats_updated = 0
            for player_data in data.get('playersA', []) + data.get('playersB', []):
                player_id = player_data['playerId']
                stats, created = PlayerStats.objects.get_or_create(
                    player_id=player_id,
                    season_id=game.league.season_id,
                    defaults={'team_id': game.home_team_id}
                )
                
                stats.games_played += 1
                stats.total_goals += player_data.get('goals', 0)
                stats.total_suspensions += player_data.get('suspensions', 0)
                if player_data.get('redCard', False):
                    stats.red_cards += 1
                stats.save()
                player_stats_updated += 1
            
            # 3. Calculate and award points
            home_score = data['homeScore']
            away_score = data['awayScore']
            
            home_standing, _ = TeamStanding.objects.get_or_create(
                team=game.home_team,
                league=game.league,
                season_id=game.league.season_id
            )
            
            away_standing, _ = TeamStanding.objects.get_or_create(
                team=game.away_team,
                league=game.league,
                season_id=game.league.season_id
            )
            
            # Update home team
            home_standing.games_played += 1
            home_standing.goals_for += home_score
            home_standing.goals_against += away_score
            home_standing.goal_difference = home_standing.goals_for - home_standing.goals_against
            
            # Update away team
            away_standing.games_played += 1
            away_standing.goals_for += away_score
            away_standing.goals_against += home_score
            away_standing.goal_difference = away_standing.goals_for - away_standing.goals_against
            
            # Award points
            points_awarded = {'homeTeam': 0, 'awayTeam': 0}
            
            if home_score > away_score:
                home_standing.wins += 1
                home_standing.points += 2
                away_standing.losses += 1
                points_awarded['homeTeam'] = 2
            elif away_score > home_score:
                away_standing.wins += 1
                away_standing.points += 2
                home_standing.losses += 1
                points_awarded['awayTeam'] = 2
            else:
                home_standing.draws += 1
                home_standing.points += 1
                away_standing.draws += 1
                away_standing.points += 1
                points_awarded['homeTeam'] = 1
                points_awarded['awayTeam'] = 1
            
            home_standing.save()
            away_standing.save()
            
            # 4. Update league rankings
            update_league_rankings(game.league.id, game.league.season_id)
            
            return Response({
                'success': True,
                'message': 'Match finalized successfully',
                'updates': {
                    'gameStatus': 'completed',
                    'playerStatsUpdated': player_stats_updated,
                    'teamStandingsUpdated': 2,
                    'leagueRankingsUpdated': True,
                    'pointsAwarded': points_awarded
                }
            })
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_league_rankings(league_id, season_id):
    """
    Update team rankings in the league
    """
    standings = TeamStanding.objects.filter(
        league_id=league_id,
        season_id=season_id
    ).order_by('-points', '-goal_difference', '-goals_for')
    
    for rank, standing in enumerate(standings, start=1):
        standing.rank = rank
        standing.save()

@api_view(['GET'])
@permission_classes([AllowAny])
def get_league_standings(request, league_id):
    """
    Get league standings
    """
    standings = TeamStanding.objects.filter(
        league_id=league_id
    ).select_related('team').order_by('-points', '-goal_difference', '-goals_for')
    
    data = [{
        'rank': standing.rank,
        'team': {
            'id': standing.team.id,
            'name': standing.team.name,
            'logo': standing.team.logo.url if standing.team.logo else None
        },
        'gamesPlayed': standing.games_played,
        'wins': standing.wins,
        'draws': standing.draws,
        'losses': standing.losses,
        'goalsFor': standing.goals_for,
        'goalsAgainst': standing.goals_against,
        'goalDifference': standing.goal_difference,
        'points': standing.points
    } for standing in standings]
    
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_player_rankings(request):
    """
    Get player rankings
    """
    season_id = request.GET.get('season')
    category = request.GET.get('category', 'top_scorer')
    
    if category == 'top_scorer':
        stats = PlayerStats.objects.filter(
            season_id=season_id
        ).select_related('player', 'team').order_by('-total_goals', 'games_played')[:20]
        
        data = [{
            'rank': idx + 1,
            'player': {
                'id': stat.player.id,
                'name': stat.player.name,
                'photo': stat.player.photo.url if stat.player.photo else None
            },
            'team': {
                'id': stat.team.id,
                'name': stat.team.name
            },
            'goals': stat.total_goals,
            'gamesPlayed': stat.games_played,
            'average': round(stat.total_goals / stat.games_played, 2) if stat.games_played > 0 else 0
        } for idx, stat in enumerate(stats)]
        
        return Response(data)
    
    return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
```

### urls.py

```python
from django.urls import path
from . import views

urlpatterns = [
    path('games/<int:game_id>/live', views.get_live_match, name='get_live_match'),
    path('games/<int:game_id>/live-update', views.update_live_match, name='update_live_match'),
    path('games/<int:game_id>/finalize', views.finalize_match, name='finalize_match'),
    path('leagues/<int:league_id>/standings', views.get_league_standings, name='league_standings'),
    path('rankings/players', views.get_player_rankings, name='player_rankings'),
]
```

---

## Option 2: FastAPI (Python)

### main.py

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PlayerData(BaseModel):
    playerId: int
    goals: int
    suspensions: int
    redCard: bool

class MatchState(BaseModel):
    gameId: int
    time: int
    isRunning: bool
    teamAName: str
    teamBName: str
    scoreA: int
    scoreB: int
    timestamp: str

class FinalizeData(BaseModel):
    gameId: int
    homeScore: int
    awayScore: int
    playersA: List[PlayerData]
    playersB: List[PlayerData]
    duration: int

# Endpoints
@app.get("/api/games/{game_id}/live")
async def get_live_match(game_id: int):
    # Fetch from database
    # This is a placeholder - implement your database logic
    return {
        "gameId": game_id,
        "time": 1850,
        "isRunning": True,
        "teamAName": "Team North",
        "teamBName": "Team South",
        "scoreA": 25,
        "scoreB": 23
    }

@app.post("/api/games/{game_id}/live-update")
async def update_live_match(game_id: int, match_state: MatchState):
    # Save to database
    # This is a placeholder - implement your database logic
    return {
        "success": True,
        "message": "Match state saved",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/games/{game_id}/finalize")
async def finalize_match(game_id: int, data: FinalizeData):
    try:
        # 1. Update game record
        # 2. Update player stats
        # 3. Update team standings
        # 4. Update rankings
        
        return {
            "success": True,
            "message": "Match finalized successfully",
            "updates": {
                "gameStatus": "completed",
                "playerStatsUpdated": len(data.playersA) + len(data.playersB),
                "teamStandingsUpdated": 2,
                "leagueRankingsUpdated": True,
                "pointsAwarded": {
                    "homeTeam": 2 if data.homeScore > data.awayScore else (1 if data.homeScore == data.awayScore else 0),
                    "awayTeam": 2 if data.awayScore > data.homeScore else (1 if data.homeScore == data.awayScore else 0)
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## Testing

### Test with curl:

```bash
# Get live match
curl http://localhost:8000/api/games/1/live

# Update live match
curl -X POST http://localhost:8000/api/games/1/live-update \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": 1,
    "time": 1850,
    "isRunning": true,
    "teamAName": "Team North",
    "teamBName": "Team South",
    "scoreA": 25,
    "scoreB": 23,
    "timestamp": "2026-02-21T10:30:45Z"
  }'

# Finalize match
curl -X POST http://localhost:8000/api/games/1/finalize \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": 1,
    "homeScore": 25,
    "awayScore": 23,
    "playersA": [{"playerId": 100, "goals": 5, "suspensions": 1, "redCard": false}],
    "playersB": [{"playerId": 200, "goals": 4, "suspensions": 0, "redCard": false}],
    "duration": 3600
  }'
```
