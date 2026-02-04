"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Clock, Eye, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NewsCard({ news }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Calculate reading time (approximately 200 words per minute)
  const wordCount = news.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'tournament': 'bg-orange-100 text-orange-700',
      'team': 'bg-blue-100 text-blue-700',
      'player': 'bg-green-100 text-green-700',
      'general': 'bg-purple-100 text-purple-700'
    };
    return colors[category] || colors.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/viewer/news/${news.id}`}>
        <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 cursor-pointer h-full flex flex-col">
          
          {/* Image header */}
          <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-500 overflow-hidden">
            {news.image_url ? (
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-6xl opacity-50">📰</div>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
                {news.category || 'News'}
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <Bookmark 
                size={16} 
                className={`transition-all duration-300 ${isBookmarked ? 'fill-current text-yellow-400' : ''}`} 
              />
            </button>

            {/* Reading time indicator */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white text-sm">
              <Clock size={14} />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Metadata */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} className="text-orange-500" />
                  <span>{formatDate(news.created_at)}</span>
                </div>
                {news.author_id && (
                  <div className="flex items-center space-x-1">
                    <User size={14} className="text-blue-500" />
                    <span>Author {news.author_id}</span>
                  </div>
                )}
              </div>
              
              {/* View count (mock data) */}
              <div className="flex items-center space-x-1 text-gray-400">
                <Eye size={14} />
                <span>{Math.floor(Math.random() * 1000) + 100}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 flex-shrink-0">
              {news.title}
            </h3>

            {/* Content Preview */}
            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 flex-1">
              {news.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {/* Word count badge */}
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  {wordCount} words
                </span>
                
                {/* Updated indicator */}
                {news.updated_at && news.updated_at !== news.created_at && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Updated
                  </span>
                )}
              </div>
              
              {/* Read more link */}
              <div className="flex items-center space-x-2 text-orange-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                <span className="text-sm">Read more</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Hover effect border */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </article>
      </Link>

      {/* Social actions (outside the link to prevent nested links) */}
      <div className="flex items-center justify-end space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200">
          <Share2 size={16} />
        </button>
        <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-all duration-200">
          <MessageCircle size={16} />
        </button>
      </div>
    </motion.div>
  );
}