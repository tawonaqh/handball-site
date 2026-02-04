"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaStar } from "react-icons/fa";
import { IoStatsChart, IoTrendingUp } from "react-icons/io5";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const [rankingsData, teamsData] = await Promise.all([
          fetcher("rankings"),
          fetcher("teams")
        ]);
        setRankings(rankingsData || []);
        setTeams(teamsData?.sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0)) || []);
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRankings();
  }, []);

  if (loading) return <LoadingSpinner message="Loading rankings..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

  const getBadgeColor = (position) => {
    if (position === 1) return 'bg-yellow-500 text-white';
    if (position === 2) return 'bg-gray-400 text-white';
    if (position === 3) return 'bg-orange-500 text-white';
    return 'bg-gray-600 text-white';
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
              <IoStatsChart />
              <span className="font-semibold">Rankings</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Team Rankings
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how teams rank across all leagues and competitions
            </p>
          </motion.div>

          {/* Rankings Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FaTrophy />
                <span>League Standings</span>
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Team</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Played</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Won</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lost</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Goal Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teams.map((team, index) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeColor(index + 1)}`}>
                            {index + 1}
                          </div>
                          {index < 3 && (
                            <FaTrophy className={`w-4 h-4 ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-orange-500'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.league?.name || 'Independent'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {team.ranking?.points || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-900">
                        {team.matches_played || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">
                        {team.wins || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-red-600 font-semibold">
                        {team.losses || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`font-semibold ${
                          (team.goal_difference || 0) > 0 ? 'text-green-600' :
                          (team.goal_difference || 0) < 0 ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {team.goal_difference > 0 ? '+' : ''}{team.goal_difference || 0}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {teams.length === 0 && (
            <div className="text-center py-20">
              <IoStatsChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No rankings available</h3>
              <p className="text-gray-500">Rankings will appear once matches are played</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}