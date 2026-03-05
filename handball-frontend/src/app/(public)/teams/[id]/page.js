"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUsers, FaTrophy, FaCalendar, FaUser } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id;
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const teamData = await fetcher(`teams/${teamId}`);
        setTeam(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [teamId]);

  if (loading) return <LoadingSpinner message="Loading team profile..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;
  if (!team) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Team not found</p>
          <Link href="/teams" className="text-orange-500 hover:underline">
            Back to Teams
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
                  <FaUsers className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Team Profile</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{team.name}</h1>
                {team.league && (
                  <p className="text-xl text-white/90">
                    {team.league.name}
                  </p>
                )}
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
                <FaUser className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {team.players?.length || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Players</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaTrophy className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {team.ranking?.points || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Points</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <IoStatsChart className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {team.ranking?.rank || '-'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Rank</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaCalendar className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {team.matches_played || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Matches</h3>
            </motion.div>
          </div>

          {/* Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {team.league && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tournament</p>
                  <Link href={`/tournaments/${team.league.id}`} className="text-lg font-semibold text-orange-600 hover:text-orange-700">
                    {team.league.name}
                  </Link>
                </div>
              )}
              {team.coach && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Coach</p>
                  <p className="text-lg font-semibold text-gray-900">{team.coach}</p>
                </div>
              )}
              {team.home_venue && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Home Venue</p>
                  <p className="text-lg font-semibold text-gray-900">{team.home_venue}</p>
                </div>
              )}
              {team.founded_year && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Founded</p>
                  <p className="text-lg font-semibold text-gray-900">{team.founded_year}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Players */}
          {team.players && team.players.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FaUser />
                  <span>Team Roster</span>
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.players.map((player) => (
                    <Link key={player.id} href={`/players/${player.id}`}>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold">
                          {player.jersey_number || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {player.name}
                          </p>
                          <p className="text-sm text-gray-500">{player.position || 'Player'}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
