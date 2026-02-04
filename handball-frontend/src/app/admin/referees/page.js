'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const RefereeCard = ({ referee, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'international': return 'bg-purple-500/20 text-purple-400';
      case 'national': return 'bg-blue-500/20 text-blue-400';
      case 'regional': return 'bg-green-500/20 text-green-400';
      case 'local': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
              {referee.name}
            </h3>
            <p className="text-sm text-gray-400">
              {referee.certification_level || 'Referee'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/referees/${referee.id}`}>
            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/admin/referees/${referee.id}/edit`}>
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
          <Award className="w-4 h-4" />
          <span>License: {referee.license_number || 'N/A'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{referee.location || 'Location not set'}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Experience: {referee.years_experience || 0} years</span>
        </div>

        {referee.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{referee.phone}</span>
          </div>
        )}

        {referee.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{referee.email}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(referee.certification_level)}`}>
            {referee.certification_level || 'local'}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(referee.status)}`}>
            {referee.status || 'inactive'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RefereesPage() {
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    async function loadReferees() {
      try {
        const data = await fetcher('referees');
        setReferees(data || []);
      } catch (error) {
        console.error('Error loading referees:', error);
        setReferees([]);
      } finally {
        setLoading(false);
      }
    }

    loadReferees();
  }, []);

  const filteredReferees = referees.filter(referee => {
    const matchesSearch = referee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referee.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referee.license_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || referee.status === filterStatus;
    const matchesLevel = filterLevel === 'all' || referee.certification_level === filterLevel;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading referees...</p>
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
            <Scale className="w-8 h-8 text-teal-500" />
            <span>Referees</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage referee registrations and certifications</p>
        </div>
        
        <Link href="/admin/referees/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Referee</span>
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
              placeholder="Search referees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Levels</option>
              <option value="international">International</option>
              <option value="national">National</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Referees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReferees.length > 0 ? (
          filteredReferees.map((referee, index) => (
            <RefereeCard key={referee.id} referee={referee} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Scale className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No referees found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterLevel !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Add your first referee to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterLevel === 'all' && (
              <Link href="/admin/referees/create">
                <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Add Referee
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}