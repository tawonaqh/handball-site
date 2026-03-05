"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaCalendar } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import TournamentStructure from "@/components/tournament/TournamentStructure";

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params.id;
  const [tournament, setTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tournamentData, standingsData] = await Promise.all([
          fetcher(`leagues/${tournamentId}`),
          fetcher(`leagues/${tournamentId}/standings`).catch(() => [])
        ]);
        
        setTournament(tournamentData);
        setStandings(standingsData || []);
      } catch (error) {
        console.error("Error fetching tournament:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [tournamentId]);

  if (loading) return <LoadingSpinner message="Loading tournament..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;
  if (!tournament) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Tournament not found</p>
          <Link href="/tournaments" className="text-orange-500 hover:underline">
            Back to Tournaments
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
                  <FaTrophy className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Tournament</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{tournament.name}</h1>
                <p className="text-xl text-white/90">{tournament.season || "Current Season"}</p>
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
                <FaTrophy className="w-8 h-8 text-orange-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tournament.type === 'knockout'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {tournament.type === 'knockout' ? 'Knockout' : 'League'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Format</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaUsers className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {tournament.teams?.length || 0}
                  {tournament.max_teams && (
                    <span className="text-lg text-gray-400">/{tournament.max_teams}</span>
                  )}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Teams</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaCalendar className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {tournament.matches_count || tournament.games?.length || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Matches</h3>
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
                  {standings.length}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Rankings</h3>
            </motion.div>
          </div>

          {/* Knockout Configuration Display */}
          {tournament.type === 'knockout' && (tournament.num_groups || tournament.teams_per_group) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-12 border border-purple-200"
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <FaTrophy className="text-purple-600" />
                Tournament Structure
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tournament.num_groups && (
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <p className="text-sm text-gray-600 mb-2">Group Stage</p>
                    <p className="text-3xl font-bold text-purple-600">{tournament.num_groups}</p>
                    <p className="text-sm text-gray-500 mt-1">Groups</p>
                  </div>
                )}
                {tournament.teams_per_group && (
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <p className="text-sm text-gray-600 mb-2">Teams per Group</p>
                    <p className="text-3xl font-bold text-purple-600">{tournament.teams_per_group}</p>
                    <p className="text-sm text-gray-500 mt-1">Teams</p>
                  </div>
                )}
                {tournament.knockout_rounds && (
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <p className="text-sm text-gray-600 mb-2">Knockout Stage</p>
                    <p className="text-lg font-bold text-purple-600 capitalize">
                      {tournament.knockout_rounds.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Starting Round</p>
                  </div>
                )}
              </div>
              {tournament.num_groups && tournament.teams_per_group && (
                <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-700">Total Capacity:</span>{' '}
                    {tournament.num_groups * tournament.teams_per_group} teams competing in{' '}
                    {tournament.num_groups} groups of {tournament.teams_per_group} teams each
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {tournament.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{tournament.description}</p>
            </motion.div>
          )}

          {/* Standings */}
          <TournamentStructure tournament={tournament} standings={standings} />

          {/* Teams */}
          {tournament.teams && tournament.teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Participating Teams</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournament.teams.map((team) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center">
                          <FaUsers className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                            {team.name}
                          </h3>
                          <p className="text-sm text-gray-500">{team.location || "Team"}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
