"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaImage, FaCalendarAlt, FaEye } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const data = await fetcher("galleries");
        setGalleries(data || []);
      } catch (error) {
        console.error("Error fetching galleries:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGalleries();
  }, []);

  if (loading) return <LoadingSpinner message="Loading gallery..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
              <FaImage />
              <span className="font-semibold">Gallery</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Photo Gallery
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore memorable moments from handball matches and events
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {gallery.cover_image ? (
                    <Image
                      src={gallery.cover_image}
                      alt={gallery.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                      <FaImage className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Photo count badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <FaImage className="w-3 h-3" />
                      <span>{gallery.photo_count || 0} photos</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {gallery.title}
                  </h3>
                  
                  {gallery.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>{new Date(gallery.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaEye className="w-3 h-3" />
                      <span>{gallery.views || 0} views</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/gallery/${gallery.id}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
                  >
                    <FaImage className="w-4 h-4" />
                    <span>View Gallery</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {galleries.length === 0 && (
            <div className="text-center py-20">
              <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No galleries found</h3>
              <p className="text-gray-500">Check back later for photo galleries</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}