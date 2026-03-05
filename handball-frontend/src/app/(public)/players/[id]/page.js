"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser, FaTrophy, FaCalendar, FaHashtag } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function PlayerDetailPage() {
  const params = useParams();
  const playerId = params.id;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const playerData = await fetcher(`players/${playerId}`);
        setPlayer(playerData);
      } catch (error) {
        console.error("Error fetching player:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [playerId]);

  if (loading) return <LoadingSpinner message="Loading player profile..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;
  if (!player) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Player not found</p>
          <Link href="/players" className="text-orange-500 hover:underline">
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full animate-pulse" />
                <div className="absolute bottom-4 right-8 w-24 h-24 border border-white rounded-lg rotate-45" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUser className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Player Profile</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{player.name}</h1>
                <div className="flex flex-wrap gap-4 text-lg">
                  {player.position && (
                    <span className="bg-white/20 px-4 py-2 rounded-full">{player.position}</span>
                  )}
                  {player.jersey_number && (
                    <span className="bg-white/20 px-4 py-2 rounded-full">#{player.jersey_number}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaHashtag className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {player.jersey_number || '-'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Jersey Number</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaUser className="w-8 h-8 text-orange-500" />
                <span className="text-lg font-bold text-gray-900 capitalize">
                  {player.position || 'N/A'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Position</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaCalendar className="w-8 h-8 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">
                  {player.date_of_birth ? new Date(player.date_of_birth).getFullYear() : 'N/A'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Birth Year</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <IoStatsChart className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {player.stats?.goals || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Goals</h3>
            </motion.div>
          </div>

          {/* Player Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Player Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {player.team && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Team</p>
                  <Link href={`/teams/${player.team.id}`} className="text-lg font-semibold text-orange-600 hover:text-orange-700">
                    {player.team.name}
                  </Link>
                </div>
              )}
              {player.nationality && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nationality</p>
                  <p className="text-lg font-semibold text-gray-900">{player.nationality}</p>
                </div>
              )}
              {player.height && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Height</p>
                  <p className="text-lg font-semibold text-gray-900">{player.height} cm</p>
                </div>
              )}
              {player.weight && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Weight</p>
                  <p className="text-lg font-semibold text-gray-900">{player.weight} kg</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Statistics */}
          {player.stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IoStatsChart className="text-orange-500" />
                Season Statistics
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-3xl font-bold text-orange-600">{player.stats.goals || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Goals</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{player.stats.assists || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Assists</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{player.stats.saves || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Saves</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">{player.stats.matches || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Matches</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
