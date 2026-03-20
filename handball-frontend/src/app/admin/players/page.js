'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Users,
  Calendar,
  Hash
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const PlayerCard = ({ player, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 group"
    >
      {/* Player Photo */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-purple-600/20 overflow-hidden">
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-purple-500/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">
            {player.name}
          </h3>
          <p className="text-sm text-gray-300">
            {player.position || 'Player'}
          </p>
        </div>
        {player.jersey_number && (
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-purple-500/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg">#{player.jersey_number}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{player.team?.name || 'No team'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/admin/players/${player.id}`}>
              <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/admin/players/${player.id}/edit`}>
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
            <Calendar className="w-4 h-4" />
            <span>Age: {player.age || 'N/A'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{player.nationality || 'N/A'}</span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
            player.status === 'active' 
              ? 'bg-green-500/20 text-green-400' 
              : player.status === 'injured'
              ? 'bg-red-500/20 text-red-400'
              : player.status === 'suspended'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {player.status || 'inactive'}
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
            player.gender === 'women' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {player.gender === 'women' ? 'Women' : 'Men'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [playersData, teamsData] = await Promise.all([
          fetcher('players'),
          fetcher('teams')
        ]);
        setPlayers(playersData || []);
        setTeams(teamsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setPlayers([]);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || player.status === filterStatus;
    const matchesTeam = filterTeam === 'all' || player.team_id?.toString() === filterTeam;
    const matchesGender = filterGender === 'all' || (player.gender || 'men') === filterGender;
    return matchesSearch && matchesStatus && matchesTeam && matchesGender;
  });
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading players...</p>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0" />
            <span>Players</span>
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage player registrations and profiles</p>
        </div>
        
        <Link href="/admin/players/create" className="flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Player</span>
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
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="injured">Injured</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Team Filter */}
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id.toString()}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="relative flex-1">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No players found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterTeam !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Add your first player to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterTeam === 'all' && (
              <Link href="/admin/players/create">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Add Player
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}