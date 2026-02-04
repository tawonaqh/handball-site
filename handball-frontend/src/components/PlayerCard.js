"use client";

import Link from 'next/link';
import { User, Trophy, Target, TrendingUp, MapPin, Calendar } from "lucide-react";

export default function PlayerCard({ player }) {
  // Get player initials
  const getInitials = (name) => {
    if (!name) return 'P';
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

  const stats = [
    { label: 'Goals', value: player.goals || 0, icon: Target },
    { label: 'Assists', value: player.assists || 0, icon: TrendingUp },
    { label: 'Matches', value: player.matches_played || 0, icon: Trophy },
  ];

  return (
    <Link href={`/viewer/players/${player.id}`}>
      <div className="card-modern group cursor-pointer overflow-hidden">
        {/* Header with gradient background */}
        <div className={`relative h-20 bg-gradient-to-br ${getGradient(player.name)} flex items-end p-4 -m-6 mb-4`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-bold border border-white/30">
              #{player.jersey_number || '00'}
            </span>
          </div>
        </div>

        {/* Player avatar and info */}
        <div className="relative">
          {/* Avatar */}
          <div className="relative -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {player.avatar ? (
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${getGradient(player.name)} flex items-center justify-center text-white font-bold text-lg`}>
                  {getInitials(player.name)}
                </div>
              )}
            </div>
          </div>

          {/* Player details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {player.name}
              </h3>
              <p className="text-sm text-gray-500">
                {player.position || 'Player'}
              </p>
            </div>

            {/* Team info */}
            {player.team && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getGradient(player.team.name)} flex items-center justify-center text-white text-xs font-bold`}>
                  {getInitials(player.team.name)}
                </div>
                <span>{player.team.name}</span>
              </div>
            )}

            {/* Player stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <stat.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              {player.age && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {player.age} years
                </div>
              )}
              {player.nationality && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {player.nationality}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </div>
    </Link>
  );
}
