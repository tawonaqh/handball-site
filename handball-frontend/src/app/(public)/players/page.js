"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser, FaTrophy, FaStar } from "react-icons/fa";
import PlayerCard from "@/components/cards/PlayerCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const data = await fetcher("players");
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlayers();
  }, []);

  if (loading) return <LoadingSpinner message="Loading players..." />;
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
              <FaUser />
              <span className="font-semibold">Players</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Handball Players
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the talented athletes making waves in Zimbabwean handball
            </p>
          </motion.div>

          {/* Players Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-20">
              <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No players found</h3>
              <p className="text-gray-500">Check back later for player updates</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}