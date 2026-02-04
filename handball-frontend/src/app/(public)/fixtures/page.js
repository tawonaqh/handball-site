"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const data = await fetcher("games");
        setFixtures(data || []);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFixtures();
  }, []);

  if (loading) return <LoadingSpinner message="Loading fixtures..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'scheduled': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

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
              <FaCalendarAlt />
              <span className="font-semibold">Fixtures</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Match Fixtures
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with all upcoming and completed handball matches
            </p>
          </motion.div>

          {/* Fixtures List */}
          <div className="space-y-6">
            {fixtures.map((fixture, index) => (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-orange-500" />
                      <span className="text-gray-600">
                        {new Date(fixture.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(fixture.status)}`}>
                      {fixture.status?.charAt(0).toUpperCase() + fixture.status?.slice(1) || 'Scheduled'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    {/* Home Team */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {fixture.home_team?.name || 'Home Team'}
                      </h3>
                      {fixture.status === 'completed' && (
                        <div className="text-3xl font-black text-orange-600">
                          {fixture.home_score || 0}
                        </div>
                      )}
                    </div>
                    
                    {/* Match Info */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span>{fixture.time || '15:00'}</span>
                      </div>
                      {fixture.venue && (
                        <div className="flex items-center justify-center space-x-2 text-gray-600 mt-1">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span className="text-sm">{fixture.venue}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Away Team */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {fixture.away_team?.name || 'Away Team'}
                      </h3>
                      {fixture.status === 'completed' && (
                        <div className="text-3xl font-black text-orange-600">
                          {fixture.away_score || 0}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {fixture.league && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <IoStatsChart className="w-4 h-4" />
                        <span className="text-sm">{fixture.league.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {fixtures.length === 0 && (
            <div className="text-center py-20">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No fixtures found</h3>
              <p className="text-gray-500">Check back later for match schedules</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}