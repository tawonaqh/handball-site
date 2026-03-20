"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import Link from "next/link";
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
        // Sort fixtures: live first, then by date (newest first)
        const sortedData = (data || []).sort((a, b) => {
          // Live matches always on top
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (b.status === 'live' && a.status !== 'live') return 1;
          
          // Then sort by date (newest first)
          return new Date(b.match_date) - new Date(a.match_date);
        });
        setFixtures(sortedData);
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
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4 sm:mb-6">
              <FaCalendarAlt />
              <span className="font-semibold">Fixtures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              Match Fixtures
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with all upcoming and completed handball matches
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {fixtures.map((fixture, index) => (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {new Date(fixture.match_date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold ${getStatusColor(fixture.status)}`}>
                      {fixture.status?.charAt(0).toUpperCase() + fixture.status?.slice(1) || 'Scheduled'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center">
                    <div className="text-center">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                        {fixture.home_team?.name || 'Home Team'}
                      </h3>
                      {fixture.status === 'completed' && (
                        <div className="text-2xl sm:text-3xl font-black text-orange-600">
                          {fixture.home_score || 0}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-gray-400 mb-1 sm:mb-2">VS</div>
                      <div className="flex items-center justify-center space-x-1 text-gray-600">
                        <FaClock className="w-3 h-3" />
                        <span className="text-xs sm:text-sm">
                          {new Date(fixture.match_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {fixture.venue && (
                        <div className="hidden sm:flex items-center justify-center space-x-1 text-gray-600 mt-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span className="text-xs">{fixture.venue}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                        {fixture.away_team?.name || 'Away Team'}
                      </h3>
                      {fixture.status === 'completed' && (
                        <div className="text-2xl sm:text-3xl font-black text-orange-600">
                          {fixture.away_score || 0}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex items-center justify-between">
                    {fixture.league && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <IoStatsChart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{fixture.league.name}</span>
                      </div>
                    )}
                    
                    {fixture.status === 'live' && (
                      <Link href={`/fixtures/${fixture.id}/live`}>
                        <button className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 animate-pulse">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Watch Live</span>
                        </button>
                      </Link>
                    )}
                    
                    {fixture.status === 'scheduled' && (
                      <span className="text-xs sm:text-sm text-gray-500">Upcoming</span>
                    )}
                  </div>
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