"use client";

import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function RankingTable({ rankings, title = "League Standings" }) {
  // Get team initials
  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Generate gradient based on name
  const getGradient = (name) => {
    const gradients = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-indigo-400 to-blue-500',
      'from-teal-400 to-green-500',
      'from-red-400 to-pink-500',
    ];
    
    const index = Math.abs(name?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0) % gradients.length;
    return gradients[index];
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</span>;
    }
  };

  const getPositionBadge = (position) => {
    if (position <= 3) {
      const colors = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800', 'bg-amber-100 text-amber-800'];
      return colors[position - 1];
    }
    return 'bg-gray-50 text-gray-600';
  };

  const getGoalDifferenceIcon = (gd) => {
    if (gd > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (gd < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getGoalDifferenceColor = (gd) => {
    if (gd > 0) return 'text-green-600';
    if (gd < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="card-modern">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 font-semibold text-sm text-gray-600">Pos</th>
              <th className="text-left p-4 font-semibold text-sm text-gray-600">Team</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">P</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">W</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">D</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">L</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">GF</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">GA</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">GD</th>
              <th className="text-center p-4 font-semibold text-sm text-gray-600">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking, index) => {
              const position = index + 1;
              const goalDifference = (ranking.goals_for || 0) - (ranking.goals_against || 0);
              
              return (
                <tr
                  key={ranking.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(position)}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPositionBadge(position)}`}>
                        {position}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradient(ranking.team?.name || 'team')} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {getInitials(ranking.team?.name || 'T')}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {ranking.team?.name || 'Unknown Team'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-medium">{ranking.played || 0}</td>
                  <td className="p-4 text-center text-sm font-medium text-green-600">{ranking.wins || 0}</td>
                  <td className="p-4 text-center text-sm font-medium text-yellow-600">{ranking.draws || 0}</td>
                  <td className="p-4 text-center text-sm font-medium text-red-600">{ranking.losses || 0}</td>
                  <td className="p-4 text-center text-sm font-medium">{ranking.goals_for || 0}</td>
                  <td className="p-4 text-center text-sm font-medium">{ranking.goals_against || 0}</td>
                  <td className="p-4 text-center">
                    <div className={`flex items-center justify-center space-x-1 text-sm font-medium ${getGoalDifferenceColor(goalDifference)}`}>
                      {getGoalDifferenceIcon(goalDifference)}
                      <span>{goalDifference > 0 ? '+' : ''}{goalDifference}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                      {ranking.points || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {rankings.map((ranking, index) => {
          const position = index + 1;
          const goalDifference = (ranking.goals_for || 0) - (ranking.goals_against || 0);
          
          return (
            <div
              key={ranking.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(position)}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPositionBadge(position)}`}>
                      {position}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(ranking.team?.name || 'team')} flex items-center justify-center text-white font-bold shadow-sm`}>
                    {getInitials(ranking.team?.name || 'T')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {ranking.team?.name || 'Unknown Team'}
                    </h3>
                  </div>
                </div>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                  {ranking.points || 0} pts
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-3 text-center text-sm">
                <div>
                  <div className="text-gray-500 text-xs">P</div>
                  <div className="font-medium">{ranking.played || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">W-D-L</div>
                  <div className="font-medium">
                    <span className="text-green-600">{ranking.wins || 0}</span>-
                    <span className="text-yellow-600">{ranking.draws || 0}</span>-
                    <span className="text-red-600">{ranking.losses || 0}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Goals</div>
                  <div className="font-medium">{ranking.goals_for || 0}:{ranking.goals_against || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">GD</div>
                  <div className={`font-medium flex items-center justify-center space-x-1 ${getGoalDifferenceColor(goalDifference)}`}>
                    {getGoalDifferenceIcon(goalDifference)}
                    <span>{goalDifference > 0 ? '+' : ''}{goalDifference}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
