"use client";

import { Calendar, MapPin, Trophy, Zap, Clock } from "lucide-react";

export default function GameCard({ game }) {
  const matchDate = new Date(game.match_date);
  const now = new Date();
  const isUpcoming = matchDate > now;
  const isLive = game.status === 'live';
  const isCompleted = game.status === 'completed' || (game.home_score !== null && game.away_score !== null);

  // Status badge configuration
  const getStatusConfig = () => {
    if (isLive) {
      return { text: 'LIVE', color: 'bg-red-500 text-white', pulse: true };
    }
    if (isCompleted) {
      return { text: 'COMPLETED', color: 'bg-green-500 text-white' };
    }
    if (isUpcoming) {
      return { text: 'UPCOMING', color: 'bg-blue-500 text-white' };
    }
    return { text: game.status?.toUpperCase() || 'SCHEDULED', color: 'bg-gray-500 text-white' };
  };

  const statusConfig = getStatusConfig();

  // Format date and time
  const formatMatchDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (matchDate.toDateString() === today.toDateString()) {
      return `Today, ${matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (matchDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return matchDate.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Get team initials
  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="card-modern group relative overflow-hidden">
      {/* Live indicator bar */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 animate-pulse" />
      )}
      
      {/* Header with status and date */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''} shadow-sm`}>
            {isLive && <Zap className="w-3 h-3 inline mr-1" />}
            {statusConfig.text}
          </span>
          {game.league?.name && (
            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
              <Trophy className="w-3 h-3 inline mr-1" />
              {game.league.name}
            </span>
          )}
        </div>
        
        <div className="text-right">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1" />
            {formatMatchDate()}
          </div>
          {game.venue && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {game.venue}
            </div>
          )}
        </div>
      </div>

      {/* Teams section */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              {getInitials(game.home_team?.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                {game.home_team?.name || 'Home Team'}
              </h3>
              <p className="text-sm text-gray-500">Home</p>
            </div>
          </div>
          
          {isCompleted && (
            <div className="text-3xl font-bold text-gray-900">
              {game.home_score ?? '-'}
            </div>
          )}
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-sm font-medium px-3 py-1 bg-gray-50 rounded-full border">
              {isCompleted ? 'FINAL' : 'VS'}
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              {getInitials(game.away_team?.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {game.away_team?.name || 'Away Team'}
              </h3>
              <p className="text-sm text-gray-500">Away</p>
            </div>
          </div>
          
          {isCompleted && (
            <div className="text-3xl font-bold text-gray-900">
              {game.away_score ?? '-'}
            </div>
          )}
        </div>
      </div>

      {/* Match info footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {game.referee && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                Ref: {game.referee.name}
              </div>
            )}
            {game.round && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                {game.round}
              </div>
            )}
          </div>
          
          {isLive && (
            <div className="flex items-center text-red-500 font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Live
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button className="btn-primary w-full">
          {isLive ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Watch Live
            </>
          ) : isCompleted ? (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              View Highlights
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Set Reminder
            </>
          )}
        </button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
}