'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaChartLine, FaUsers, FaFlag, FaFutbol } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ClubPowerRanking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('all');

  useEffect(() => {
    async function loadRankings() {
      try {
        const data = await fetcher('rankings');
        const sorted = data
          .filter(r => r.team && r.points != null)
          .sort((a, b) => b.points - a.points);
        setRankings(sorted);
      } catch (error) {
        console.error('Error loading rankings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  // Get unique leagues for filtering
  const leagues = [...new Set(rankings.map(r => r.league?.name).filter(Boolean))];
  
  // Filter rankings by selected league
  const filteredRankings = selectedLeague === 'all' 
    ? rankings 
    : rankings.filter(r => r.league?.name === selectedLeague);

  const chartData = {
    labels: filteredRankings.slice(0, 10).map(r => r.team.name),
    datasets: [
      {
        label: 'Power Points',
        data: filteredRankings.slice(0, 10).map(r => r.points),
        backgroundColor: filteredRankings.slice(0, 10).map((_, i) =>
          i === 0 ? 'rgba(255, 215, 0, 0.9)' : // Gold
          i === 1 ? 'rgba(192, 192, 192, 0.9)' : // Silver
          i === 2 ? 'rgba(205, 127, 50, 0.9)' : // Bronze
          'rgba(255, 99, 71, 0.8)'             // Others
        ),
        borderColor: filteredRankings.slice(0, 10).map((_, i) =>
          i === 0 ? 'rgba(255, 215, 0, 1)' :
          i === 1 ? 'rgba(192, 192, 192, 1)' :
          i === 2 ? 'rgba(205, 127, 50, 1)' :
          'rgba(255, 99, 71, 1)'
        ),
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const distributionData = {
    labels: ['Top 3', 'Top 10', 'Remaining'],
    datasets: [
      {
        data: [
          filteredRankings.slice(0, 3).reduce((sum, r) => sum + r.points, 0),
          filteredRankings.slice(3, 10).reduce((sum, r) => sum + r.points, 0),
          filteredRankings.slice(10).reduce((sum, r) => sum + r.points, 0)
        ],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 99, 71, 0.8)',
          'rgba(100, 149, 237, 0.8)'
        ],
        borderColor: [
          'rgba(255, 215, 0, 1)',
          'rgba(255, 99, 71, 1)',
          'rgba(100, 149, 237, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: (context) => {
            const team = filteredRankings[context.dataIndex];
            return [
              `Points: ${context.raw}`,
              `Wins: ${team.wins || 0}`,
              `Goal Diff: ${(team.goals_for || 0) - (team.goals_against || 0)}`,
              `Matches: ${team.played || 0}`
            ];
          }
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#7c2d12',
          font: { weight: '600', size: 12 }
        },
        grid: { 
          color: 'rgba(251, 146, 60, 0.2)',
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Power Points',
          color: '#7c2d12',
          font: { weight: 'bold', size: 14 }
        }
      },
      x: {
        ticks: { 
          color: '#7c2d12',
          font: { weight: '600', size: 11 },
          maxRotation: 45
        },
        grid: { display: false },
      },
    },
  };

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#7c2d12',
          font: { weight: '600', size: 12 },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} points (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 text-lg font-semibold">Loading power rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-orange-500 text-white px-6 py-3 rounded-full mb-4">
            <FaTrophy className="text-yellow-300" size={24} />
            <h1 className="text-3xl md:text-4xl font-black">Club Power Rankings</h1>
          </div>
          <p className="text-orange-800 text-lg max-w-2xl mx-auto">
            Track team performance across all leagues with our comprehensive power ranking system
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-orange-700">
              <FaFlag size={20} />
              <span className="font-semibold">Filter by League:</span>
            </div>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-4 py-2 border border-orange-300 rounded-lg bg-white text-orange-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Leagues</option>
              {leagues.map(league => (
                <option key={league} value={league}>{league}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaUsers className="text-orange-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-orange-700">{filteredRankings.length}</div>
            <div className="text-orange-600 font-medium">Total Teams</div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaChartLine className="text-green-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-green-700">
              {filteredRankings.reduce((sum, r) => sum + r.points, 0)}
            </div>
            <div className="text-green-600 font-medium">Total Points</div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaFutbol className="text-blue-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-blue-700">
              {filteredRankings.reduce((sum, r) => sum + (r.played || 0), 0)}
            </div>
            <div className="text-blue-600 font-medium">Matches Played</div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaMedal className="text-purple-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-purple-700">
              {filteredRankings.reduce((sum, r) => sum + (r.wins || 0), 0)}
            </div>
            <div className="text-purple-600 font-medium">Total Wins</div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-orange-800 flex items-center space-x-2">
                <FaChartLine className="text-orange-600" />
                <span>Top 10 Teams Power Ranking</span>
              </h2>
              <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-medium">
                {selectedLeague === 'all' ? 'All Leagues' : selectedLeague}
              </span>
            </div>
            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-orange-800 mb-6 flex items-center space-x-2">
              <FaTrophy className="text-orange-600" />
              <span>Points Distribution</span>
            </h2>
            <div className="h-64">
              <Doughnut data={distributionData} options={distributionOptions} />
            </div>
          </motion.div>
        </div>

        {/* Top 3 Podium */}
        {filteredRankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-orange-800 mb-6 text-center flex items-center justify-center space-x-2">
              <FaMedal className="text-orange-600" />
              <span>Top Performers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRankings.slice(0, 3).map((ranking, index) => (
                <motion.div
                  key={ranking.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`relative rounded-2xl shadow-xl p-6 text-center transform ${
                    index === 0 ? 'md:-translate-y-4 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300' :
                    index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300' :
                    'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200'
                  }`}
                >
                  {/* Medal Icon */}
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    'bg-orange-500'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{ranking.team.name}</h3>
                    <div className="text-3xl font-black text-orange-700 mb-2">{ranking.points}</div>
                    <div className="text-sm text-orange-600 font-medium">Power Points</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="bg-white/50 rounded p-2">
                        <div className="font-semibold text-gray-700">{ranking.wins || 0}</div>
                        <div className="text-gray-500">Wins</div>
                      </div>
                      <div className="bg-white/50 rounded p-2">
                        <div className="font-semibold text-gray-700">{ranking.played || 0}</div>
                        <div className="text-gray-500">Matches</div>
                      </div>
                    </div>

                    {ranking.league && (
                      <div className="mt-3 text-xs text-gray-600 bg-white/70 rounded-full px-3 py-1 inline-block">
                        {ranking.league.name}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Full Rankings Table */}
        {filteredRankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-orange-100">
              <h2 className="text-xl font-bold text-orange-800">Complete Rankings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">League</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">W-L-D</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Goal Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {filteredRankings.map((ranking, index) => (
                    <tr key={ranking.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {ranking.team.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {ranking.league?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-700">
                        {ranking.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ranking.wins || 0}-{ranking.losses || 0}-{ranking.draws || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${
                          (ranking.goals_for - ranking.goals_against) > 0 ? 'text-green-600' :
                          (ranking.goals_for - ranking.goals_against) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {ranking.goals_for - ranking.goals_against > 0 ? '+' : ''}
                          {ranking.goals_for - ranking.goals_against}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}