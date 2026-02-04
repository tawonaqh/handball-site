"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaNewspaper, FaCalendarAlt, FaUser } from "react-icons/fa";
import NewsCard from "@/components/cards/NewsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await fetcher("news");
        setNews(data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNews();
  }, []);

  if (loading) return <LoadingSpinner message="Loading news..." />;
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
              <FaNewspaper />
              <span className="font-semibold">News</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Latest News
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest handball news, match reports, and announcements
            </p>
          </motion.div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-20">
              <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No news articles found</h3>
              <p className="text-gray-500">Check back later for the latest updates</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}