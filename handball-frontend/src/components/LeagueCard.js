"use client";

import Link from 'next/link';
import { Trophy, Users, Calendar, MapPin, Star, TrendingUp } from "lucide-react";

export default function LeagueCard({ league }) {
  // Get league initials
  const getInitials = (name) => {
    if (!name) return 'L';
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

  const teamCount = league.teams?.length || 0;
  const gameCount = league.games?.length || 0;
  const isActive = league.status === 'active' || league.is_active;
  
  const stats = [
    { label: 'Teams', value: teamCount, icon: Users },
    { label: 'Matches', value: gameCount, icon: Trophy },
    { label: 'Season', value: league.season || new Date().getFullYear(), icon: Calendar },
  ];

  // Format date
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Link href={`/viewer/leagues/${league.id}`}>
      <div className="card-modern group cursor-pointer overflow-hidden">
        {/* Header with gradient background */}
        <div className={`relative h-28 bg-gradient-to-br ${getGradient(league.name)} flex items-end p-6 -m-6 mb-4`}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-4 right-4 z-10">
            {isActive && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                <Star className="w-3 h-3 inline mr-1" />
                Active
              </span>
            )}
          </div>
          
          {/* League icon/logo */}
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
              {league.logo ? (
                <img 
                  src={league.logo} 
                  alt={league.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                getInitials(league.name)
              )}
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1 group-hover:text-yellow-200 transition-colors">
                {league.name}
              </h3>
              <p className="text-white/80 text-sm">
                {league.description || 'Professional League'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* League info */}
          <div className="space-y-2">
            {league.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {league.location}
              </div>
            )}
            
            {league.start_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Started {formatDate(league.start_date)}
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-orange-500" />
                  </div>
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

          {/* League tier/level */}
          {league.tier && (
            <div className="flex items-center justify-center pt-3">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Tier {league.tier}
              </span>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </div>
    </Link>
  );
}
