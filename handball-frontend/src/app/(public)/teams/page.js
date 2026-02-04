"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUsers, FaTrophy, FaStar } from "react-icons/fa";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await fetcher("teams");
        setTeams(data?.sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0)) || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeams();
  }, []);

  if (loading) return <LoadingSpinner message="Loading teams..." />;
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
              <FaUsers />
              <span className="font-semibold">Teams</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Handball Teams
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all the handball teams competing across Zimbabwe's leagues
            </p>
          </motion.div>

          {/* Teams Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-400">
                  {/* Ranking badge */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-orange-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
                    <p className="text-white/90 text-sm">{team.league?.name || "Independent"}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {team.ranking?.points || 0}
                      </div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {team.wins || 0}
                      </div>
                      <div className="text-sm text-gray-500">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {team.players_count || 0}
                      </div>
                      <div className="text-sm text-gray-500">Players</div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/teams/${team.id}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
                  >
                    <FaTrophy className="w-4 h-4" />
                    <span>View Team</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-20">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams found</h3>
              <p className="text-gray-500">Check back later for team updates</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}