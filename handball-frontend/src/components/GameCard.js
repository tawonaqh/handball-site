// src/components/GameCard.js
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
      return { text: 'COMPLETED', color: 'bg-green-100 text-green-800' };
    }
    if (isUpcoming) {
      return { text: 'UPCOMING', color: 'bg-blue-100 text-blue-800' };
    }
    return { text: game.status?.toUpperCase() || 'SCHEDULED', color: 'bg-gray-100 text-gray-800' };
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

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-200 group">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
            {statusConfig.text}
          </span>
          {game.league?.name && (
            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
              {game.league.name}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {formatMatchDate()}
        </div>
      </div>

      {/* Teams and Score */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              {game.home_team?.name || 'TBD'}
            </span>
          </div>
          {isCompleted && (
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold text-xl min-w-16 text-center">
              {game.home_score}
            </div>
          )}
        </div>

        {/* VS Separator */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-sm font-bold text-gray-600">VS</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              {game.away_team?.name || 'TBD'}
            </span>
          </div>
          {isCompleted && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-xl min-w-16 text-center">
              {game.away_score}
            </div>
          )}
        </div>
      </div>

      {/* Match Details */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Venue</div>
            <div className="text-gray-900 font-semibold truncate">
              {game.venue || 'TBD'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Round</div>
            <div className="text-gray-900 font-semibold">
              {game.round || 'Group Stage'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg">
          {isLive ? 'Watch Live' : isCompleted ? 'View Highlights' : 'Set Reminder'}
        </button>
      </div>
    </div>
  );
}