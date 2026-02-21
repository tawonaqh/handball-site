"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaStar } from "react-icons/fa";
import { IoStatsChart, IoTrendingUp } from "react-icons/io5";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function RankingsPage() {
  const [standings, setStandings] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const leaguesData = await fetcher("leagues");
        setLeagues(leaguesData || []);
        
        // Select first league by default
        if (leaguesData && leaguesData.length > 0) {
          setSelectedLeague(leaguesData[0].id);
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchStandings() {
      if (!selectedLeague) return;
      
      try {
        const standingsData = await fetcher(`leagues/${selectedLeague}/standings`);
        setStandings(standingsData || []);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    }
    
    fetchStandings();
  }, [selectedLeague]);

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

            {/* League Selector */}
            {leagues.length > 0 && (
              <div className="mt-8 flex justify-center">
                <select
                  value={selectedLeague || ''}
                  onChange={(e) => setSelectedLeague(parseInt(e.target.value))}
                  className="px-6 py-3 bg-white border-2 border-orange-500 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>{league.name}</option>
                  ))}
                </select>
              </div>
            )}
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
                  {standings.map((standing, index) => (
                    <motion.tr
                      key={standing.team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeColor(standing.rank)}`}>
                            {standing.rank}
                          </div>
                          {standing.rank <= 3 && (
                            <FaTrophy className={`w-4 h-4 ${
                              standing.rank === 1 ? 'text-yellow-500' :
                              standing.rank === 2 ? 'text-gray-400' :
                              'text-orange-500'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{standing.team.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {standing.points}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-900">
                        {standing.gamesPlayed}
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">
                        {standing.wins}
                      </td>
                      <td className="px-6 py-4 text-center text-red-600 font-semibold">
                        {standing.losses}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`font-semibold ${
                          standing.goalDifference > 0 ? 'text-green-600' :
                          standing.goalDifference < 0 ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {standings.length === 0 && selectedLeague && (
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