"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay, FaExpand, FaDownload, FaHeart, FaShare, FaEye } from 'react-icons/fa';
import { IoCalendar, IoTime, IoCamera, IoVideocam } from 'react-icons/io5';
import { useState } from 'react';

export default function GalleryItem({ item }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 10);
  const [views] = useState(Math.floor(Math.random() * 500) + 50);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality would go here
    console.log('Sharing item:', item.title);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500"
    >
      {/* Media Container */}
      <div className="relative aspect-video bg-gradient-to-br from-orange-500 to-yellow-500 overflow-hidden">
        {item.media_type === 'image' ? (
          <>
            <Image
              src={item.media_url}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            
            {/* Image type indicator */}
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2">
              <IoCamera className="text-white" size={16} />
            </div>
          </>
        ) : (
          <>
            <video 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              poster={item.thumbnail_url}
            >
              <source src={item.media_url} type="video/mp4" />
            </video>
            
            {/* Video overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <FaPlay className="text-white ml-1" size={20} />
              </div>
            </div>
            
            {/* Video type indicator */}
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2">
              <IoVideocam className="text-white" size={16} />
            </div>
            
            {/* Duration (mock) */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
              {Math.floor(Math.random() * 5) + 1}:30
            </div>
          </>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            title="Share"
          >
            <FaShare size={14} />
          </button>
          <button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            title="Expand"
          >
            <FaExpand size={14} />
          </button>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <FaEye size={12} />
            <span>{views}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <FaHeart size={12} className={isLiked ? 'text-red-400' : ''} />
            <span>{likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <IoCalendar className="text-orange-500" size={14} />
              <span>{formatDate(item.created_at)}</span>
            </div>
            {item.event && (
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-600 font-medium">{item.event}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaHeart size={12} className={isLiked ? 'text-red-500' : ''} />
              <span>{likes}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
            >
              <FaShare size={12} />
              <span>Share</span>
            </button>
          </div>

          <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors duration-200">
            <FaDownload size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Category badge */}
      {item.category && (
        <div className="absolute top-5 left-5">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-white/50">
            {item.category}
          </span>
        </div>
      )}

      {/* Hover effect border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </motion.div>
  );
}
