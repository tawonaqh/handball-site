"use client";

import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import GalleryItem from "@/components/GalleryItem";
import { motion } from "framer-motion";
import { Camera, Video, Image as ImageIcon, Play, Grid3X3, Filter, Search, Download, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await fetcher('galleries');
        setItems(data);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Filter items based on selected filters
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.media_type === selectedType;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // Get unique categories and types
  const categories = [...new Set(items.map(item => item.category || 'General'))];
  const types = [...new Set(items.map(item => item.media_type))];

  // Calculate statistics
  const totalItems = filteredItems.length;
  const imageCount = filteredItems.filter(item => item.media_type === 'image').length;
  const videoCount = filteredItems.filter(item => item.media_type === 'video').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <ViewerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading gallery...</p>
          </div>
        </div>
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 py-20 overflow-hidden -mt-20 pt-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full mb-6">
                <Camera className="text-yellow-300" size={20} />
                <span className="font-semibold">Media Gallery</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Capture the <span className="text-yellow-300">Action</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-orange-100 max-w-3xl mx-auto mb-8">
                Relive the excitement with our collection of photos and videos from matches, tournaments, and behind-the-scenes moments.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-yellow-300 mb-2">{totalItems}</div>
                  <div className="text-orange-100 text-sm md:text-base">Total Media</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center border-x border-white/20"
                >
                  <div className="text-3xl md:text-4xl font-black text-yellow-300 mb-2">{imageCount}</div>
                  <div className="text-orange-100 text-sm md:text-base">Photos</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-yellow-300 mb-2">{videoCount}</div>
                  <div className="text-orange-100 text-sm md:text-base">Videos</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search photos and videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-3">
                <Filter className="text-gray-500" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-3">
                <Grid3X3 className="text-gray-500" size={20} />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="image">Photos</option>
                  <option value="video">Videos</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedType !== 'all' || searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Type: {selectedType === 'image' ? 'Photos' : 'Videos'}
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Search: "{searchTerm}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSearchTerm('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Gallery Content */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="text-6xl mb-6">📸</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                {items.length === 0 ? 'No Media Available' : 'No Results Found'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {items.length === 0 
                  ? 'Check back later for photos and videos from our events and matches.'
                  : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                }
              </p>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSearchTerm('');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <motion.section
                  key={category}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  {/* Category Header */}
                  <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                        {category === 'Matches' ? <Play className="text-white" size={24} /> :
                         category === 'Training' ? <Camera className="text-white" size={24} /> :
                         <ImageIcon className="text-white" size={24} />}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
                        <p className="text-gray-600">
                          {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200">
                        <Download size={20} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Gallery Grid */}
                  <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {categoryItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GalleryItem item={item} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Love What You See?</h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Follow us on social media for more behind-the-scenes content and live updates from matches and events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Heart size={20} />
                  <span>Follow Updates</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Share2 size={20} />
                  <span>Share Gallery</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}