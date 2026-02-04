'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const AdCard = ({ ad, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'banner': return 'bg-blue-500/20 text-blue-400';
      case 'sidebar': return 'bg-purple-500/20 text-purple-400';
      case 'popup': return 'bg-orange-500/20 text-orange-400';
      case 'sponsored': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 group"
    >
      {/* Ad Preview */}
      <div className="relative h-32 bg-gray-700/50 overflow-hidden">
        {ad.image_url ? (
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-12 h-12 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2 right-2 flex space-x-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(ad.type)}`}>
            {ad.type || 'banner'}
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ad.status)}`}>
            {ad.status || 'draft'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors line-clamp-1">
              {ad.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {ad.advertiser || 'Advertiser'}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Link href={`/admin/ads/${ad.id}`}>
              <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/admin/ads/${ad.id}/edit`}>
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
          <p className="text-sm text-gray-300 line-clamp-2">
            {ad.description || 'No description available'}
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {ad.start_date && ad.end_date
                ? `${new Date(ad.start_date).toLocaleDateString()} - ${new Date(ad.end_date).toLocaleDateString()}`
                : 'No schedule set'
              }
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Position: {ad.position || 'Not set'}</span>
          </div>

          {ad.target_url && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <ExternalLink className="w-4 h-4" />
              <span className="truncate">{ad.target_url}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700/50">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>{ad.impressions || 0} views</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>${ad.budget || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    async function loadAds() {
      try {
        const data = await fetcher('ads');
        setAds(data || []);
      } catch (error) {
        console.error('Error loading ads:', error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    }

    loadAds();
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.advertiser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    const matchesType = filterType === 'all' || ad.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading ads...</p>
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
            <Target className="w-8 h-8 text-red-500" />
            <span>Advertisements</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage advertising campaigns and placements</p>
        </div>
        
        <Link href="/admin/ads/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Ad</span>
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
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="popup">Popup</option>
              <option value="sponsored">Sponsored</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.length > 0 ? (
          filteredAds.map((ad, index) => (
            <AdCard key={ad.id} ad={ad} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No ads found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Create your first advertisement to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
              <Link href="/admin/ads/create">
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Create Ad
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}