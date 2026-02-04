"use client";

import { ExternalLink, Eye, Clock, ArrowRight } from "lucide-react";

export default function AdBanner({ ad }) {
  const isActive = ad.is_active !== false;
  const hasExpiry = ad.expires_at && new Date(ad.expires_at) > new Date();
  
  return (
    <div className="card-modern group cursor-pointer overflow-hidden">
      <a 
        href={ad.link || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image container */}
        <div className="relative overflow-hidden -m-6 mb-4">
          <div className="aspect-[16/9] relative">
            {ad.image_url ? (
              <img 
                src={ad.image_url} 
                alt={ad.title || 'Advertisement'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Advertisement</p>
                </div>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Status badges */}
            <div className="absolute top-3 left-3 flex space-x-2">
              {isActive && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  Live
                </span>
              )}
              {hasExpiry && (
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Limited
                </span>
              )}
            </div>

            {/* External link indicator */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Hover overlay content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="btn-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
              {ad.title || 'Advertisement'}
            </h3>
            {ad.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {ad.description}
              </p>
            )}
          </div>

          {/* Ad metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {ad.company && (
                <span className="font-medium">{ad.company}</span>
              )}
              {ad.category && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {ad.category}
                </span>
              )}
            </div>
            
            {ad.expires_at && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Expires {new Date(ad.expires_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Call to action */}
          <div className="pt-2">
            <div className="flex items-center text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/20 rounded-2xl transition-colors duration-300 pointer-events-none" />
      </a>
    </div>
  );
}
