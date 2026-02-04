'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Trophy,
  Users,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const RankingCard = ({ ranking, index }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return TrendingUp;
    if (trend < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const TrendIcon = getTrendIcon(ranking.position_change);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
            ranking.position === 1 
              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' 
              : ranking.position === 2
              ? 'bg-gradient-to-br from-gray-400 to-gray-500'
              : ranking.position === 3
              ? 'bg-gradient-to-br from-orange-600 to-orange-700'
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}>
            #{ranking.position}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
              {ranking.team?.name || 'Team Name'}
            </h3>
            <p className="text-sm text-gray-400">
              {ranking.league?.name || 'League'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/rankings/${ranking.id}`}>
            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/admin/rankings/${ranking.id}/edit`}>
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
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{ranking.points || 0}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{ranking.wins || 0}</div>
            <div className="text-xs text-gray-400">Wins</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{ranking.losses || 0}</div>
            <div className="text-xs text-gray-400">Losses</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <div className="text-white font-medium">{ranking.goals_for || 0}</div>
            <div className="text-xs text-gray-400">Goals For</div>
          </div>
          <div>
            <div className="text-white font-medium">{ranking.goals_against || 0}</div>
            <div className="text-xs text-gray-400">Goals Against</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Trophy className="w-4 h-4" />
            <span>GD: {(ranking.goals_for || 0) - (ranking.goals_against || 0)}</span>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor(ranking.position_change)}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(ranking.position_change || 0)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLeague, setFilterLeague] = useState('all');
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [rankingsData, leaguesData] = await Promise.all([
          fetcher('rankings'),
          fetcher('leagues')
        ]);
        setRankings(rankingsData || []);
        setLeagues(leaguesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setRankings([]);
        setLeagues([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredRankings = rankings.filter(ranking => {
    const matchesSearch = ranking.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ranking.league?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLeague = filterLeague === 'all' || ranking.league_id?.toString() === filterLeague;
    return matchesSearch && matchesLeague;
  }).sort((a, b) => (a.position || 999) - (b.position || 999));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading rankings...</p>
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
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <span>Rankings</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage team standings and league tables</p>
        </div>
        
        <Link href="/admin/rankings/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Ranking</span>
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
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams or leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            />
          </div>

          {/* League Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLeague}
              onChange={(e) => setFilterLeague(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none"
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

      {/* Rankings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRankings.length > 0 ? (
          filteredRankings.map((ranking, index) => (
            <RankingCard key={ranking.id} ranking={ranking} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No rankings found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterLeague !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Add your first ranking entry to get started'
              }
            </p>
            {!searchTerm && filterLeague === 'all' && (
              <Link href="/admin/rankings/create">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Add Ranking
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}