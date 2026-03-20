'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  User,
  Trophy,
  Calendar
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const TeamCard = ({ team, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 group"
    >
      {/* Team Logo/Header */}
      <div className="relative h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 overflow-hidden">
        {team.logo_url ? (
          <img
            src={team.logo_url}
            alt={team.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-16 h-16 text-green-500/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
              {team.name}
            </h3>
            <p className="text-sm text-gray-400">
              {team.category || 'Team'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/admin/teams/${team.id}`}>
              <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/admin/teams/${team.id}/edit`}>
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
            <MapPin className="w-4 h-4" />
            <span>{team.location || 'Location not set'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>Coach: {team.coach || 'Not assigned'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Trophy className="w-4 h-4" />
            <span>League: {team.league?.name || 'Not assigned'}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Ranking:</span>
              <span className="text-green-400 font-semibold">{team.ranking?.points || 0} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                team.gender === 'women' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {team.gender === 'women' ? 'Women' : 'Men'}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                team.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : team.status === 'inactive'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {team.status || 'active'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await fetcher('teams');
        setTeams(data || []);
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.coach?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || team.status === filterStatus;
    const matchesGender = filterGender === 'all' || (team.gender || 'men') === filterGender;
    return matchesSearch && matchesFilter && matchesGender;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading teams...</p>
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
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
            <span>Teams</span>
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage team registrations and information</p>
        </div>
        
        <Link href="/admin/teams/create" className="flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Register Team</span>
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
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Genders</option>
              <option value="men">Men's</option>
              <option value="women">Women's</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No teams found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Register your first team to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link href="/admin/teams/create">
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Register Team
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}