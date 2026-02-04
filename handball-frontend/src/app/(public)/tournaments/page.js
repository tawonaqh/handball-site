"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTrophy, FaCalendarAlt, FaUsers } from "react-icons/fa";
import TournamentCard from "@/components/cards/TournamentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const data = await fetcher("tournaments");
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
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
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