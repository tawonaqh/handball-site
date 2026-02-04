'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Users,
  MapPin,
  PlayCircle,
  Pause,
  Square
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const GameCard = ({ game, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'postponed': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return PlayCircle;
      case 'completed': return Square;
      case 'postponed': return Pause;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(game.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
              {game.home_team?.name || 'Team A'} vs {game.away_team?.name || 'Team B'}
            </h3>
            <p className="text-sm text-gray-400">
              {game.league?.name || 'Match'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/games/${game.id}`}>
            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/admin/games/${game.id}/edit`}>
            <button className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {game.match_date ? new Date(game.match_date).toLocaleDateString() : 'TBD'} 
            {game.match_time && ` at ${game.match_time}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{game.venue || 'Venue TBD'}</span>
        </div>

        {game.status === 'completed' && (
          <div className="flex items-center justify-center space-x-4 py-2 bg-gray-700/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{game.home_score || 0}</div>
              <div className="text-xs text-gray-400">{game.home_team?.name || 'Home'}</div>
            </div>
            <div className="text-gray-400">-</div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{game.away_score || 0}</div>
              <div className="text-xs text-gray-400">{game.away_team?.name || 'Away'}</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>Round {game.round || 1}</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{game.status || 'scheduled'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeague, setFilterLeague] = useState('all');
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesData, leaguesData] = await Promise.all([
          fetcher('games'),
          fetcher('leagues')
        ]);
        setGames(gamesData || []);
        setLeagues(leaguesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setGames([]);
        setLeagues([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.home_team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.away_team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus;
    const matchesLeague = filterLeague === 'all' || game.league_id?.toString() === filterLeague;
    return matchesSearch && matchesStatus && matchesLeague;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading games...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-indigo-500" />
            <span>Games</span>
          </h1>
          <p className="text-gray-400 mt-2">Schedule and manage match fixtures</p>
        </div>
        
        <Link href="/admin/games/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Game</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* League Filter */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLeague}
              onChange={(e) => setFilterLeague(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Leagues</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id.toString()}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No games found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterLeague !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Schedule your first game to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterLeague === 'all' && (
              <Link href="/admin/games/create">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Schedule Game
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}