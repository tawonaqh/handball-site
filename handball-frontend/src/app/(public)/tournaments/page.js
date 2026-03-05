"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTrophy, FaCalendarAlt, FaUsers } from "react-icons/fa";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const data = await fetcher("leagues"); // Fetch from leagues endpoint
        setTournaments(data || []);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTournaments();
  }, []);

  if (loading) return <LoadingSpinner message="Loading tournaments..." />;
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
              <FaTrophy />
              <span className="font-semibold">Tournaments</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Handball Tournaments
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exciting handball tournaments happening across Zimbabwe
            </p>
          </motion.div>

          {/* Tournaments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-400">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{tournament.name}</h3>
                    <p className="text-white/90 text-sm">{tournament.season || "Current Season"}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {tournament.teams_count || 0}
                      </div>
                      <div className="text-sm text-gray-500">Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {tournament.matches_count || 0}
                      </div>
                      <div className="text-sm text-gray-500">Matches</div>
                    </div>
                  </div>
                  
                  {tournament.description && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {tournament.description}
                    </p>
                  )}
                  
                  <a
                    href={`/tournaments/${tournament.id}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
                  >
                    <FaTrophy className="w-4 h-4" />
                    <span>View Tournament</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-center py-20">
              <FaTrophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tournaments found</h3>
              <p className="text-gray-500">Check back later for upcoming tournaments</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}