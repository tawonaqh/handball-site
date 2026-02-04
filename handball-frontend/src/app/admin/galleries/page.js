'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Tag,
  Download,
  Upload
} from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const GalleryCard = ({ gallery, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'private': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 group"
    >
      {/* Image Preview */}
      <div className="relative h-48 bg-gray-700/50 overflow-hidden">
        {gallery.featured_image ? (
          <img
            src={gallery.featured_image}
            alt={gallery.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-16 h-16 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(gallery.status)}`}>
            {gallery.status || 'draft'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors line-clamp-2">
              {gallery.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {gallery.category || 'Gallery'}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Link href={`/admin/galleries/${gallery.id}`}>
              <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/admin/galleries/${gallery.id}/edit`}>
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
            {gallery.description || 'No description available'}
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {gallery.event_date 
                ? new Date(gallery.event_date).toLocaleDateString()
                : gallery.created_at 
                ? new Date(gallery.created_at).toLocaleDateString()
                : 'No date'
              }
            </span>
          </div>

          {gallery.tags && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Tag className="w-4 h-4" />
              <div className="flex flex-wrap gap-1">
                {gallery.tags.split(',').slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-700/50 rounded text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Upload className="w-4 h-4" />
              <span>{gallery.images_count || 0} images</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Download className="w-4 h-4" />
              <span>{gallery.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    async function loadGalleries() {
      try {
        const data = await fetcher('galleries');
        setGalleries(data || []);
      } catch (error) {
        console.error('Error loading galleries:', error);
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    }

    loadGalleries();
  }, []);

  const categories = [...new Set(galleries.map(gallery => gallery.category).filter(Boolean))];

  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || gallery.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || gallery.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading galleries...</p>
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
            <Image className="w-8 h-8 text-pink-500" />
            <span>Galleries</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage photo galleries and media collections</p>
        </div>
        
        <Link href="/admin/galleries/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Gallery</span>
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
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleries.length > 0 ? (
          filteredGalleries.map((gallery, index) => (
            <GalleryCard key={gallery.id} gallery={gallery} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No galleries found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Create your first gallery to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <Link href="/admin/galleries/create">
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Create Gallery
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}