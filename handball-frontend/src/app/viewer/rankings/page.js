'use client';

import { useEffect, useState } from 'react';
import { fetcher } from "@/lib/api";
import Link from 'next/link';
import Image from 'next/image';
import PowerRankingChart from '@/components/PowerRankingChart';
import ViewerLayout from '@/components/ViewerLayout';

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        setLoading(true);
        const data = await fetcher('rankings');
        const sortedData = data.sort((a, b) => (b.points || 0) - (a.points || 0));
        setRankings(sortedData);

        const uniqueLeagues = Array.from(
          new Set(data.map(r => r.league?.name).filter(Boolean))
        );
        setLeagues(uniqueLeagues);
      } catch (error) {
        console.error('Error loading rankings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  const filteredRankings =
    selectedLeague === "all"
      ? rankings
      : rankings.filter(r => r.league?.name === selectedLeague);

  const grouped = filteredRankings.reduce((acc, r) => {
    const leagueName = r.league?.name || "Independent Teams";
    if (!acc[leagueName]) acc[leagueName] = [];
    acc[leagueName].push(r);
    return acc;
  }, {});

  // Calculate statistics
  const totalTeams = rankings.length;
  const totalLeagues = leagues.length;
  const averagePoints = rankings.length > 0 
    ? Math.round(rankings.reduce((sum, r) => sum + (r.points || 0), 0) / rankings.length)
    : 0;

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-500 text-white';
      case 2: return 'from-gray-400 to-gray-500 text-white';
      case 3: return 'from-orange-600 to-orange-700 text-white';
      default: return 'from-white to-gray-50 text-gray-900';
    }
  };

  if (loading) {
    return (
      <ViewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading rankings...</p>
          </div>
        </div>
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Club Rankings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Track team performance across all leagues with comprehensive statistics and standings
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {totalTeams}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Teams</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {totalLeagues}
                </div>
                <div className="text-sm text-gray-600 font-medium">Leagues</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {averagePoints}
                </div>
                <div className="text-sm text-gray-600 font-medium">Avg Points</div>
              </div>
            </div>

            {/* League Filter */}
            {leagues.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-800">Filter by League:</label>
                  <select
                    value={selectedLeague}
                    onChange={e => setSelectedLeague(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="all">All Leagues</option>
                    {leagues.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Rankings Tables */}
          <div className="space-y-8">
            {Object.entries(grouped).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">No Rankings Available</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are currently no team rankings available. Check back later for updates!
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([league, leagueRankings]) => (
                <section key={league} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* League Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {league}
                        </h2>
                        <p className="text-orange-100 font-medium">
                          {leagueRankings.length} Teams • Updated {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <span className="text-white text-2xl">🏆</span>
                      </div>
                    </div>
                  </div>

                  {/* Rankings Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Pos
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            P
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            W
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            D
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            L
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            GF
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            GA
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            GD
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            PTS
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Form
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leagueRankings.map((ranking, index) => {
                          const goalDifference = (ranking.goals_for || 0) - (ranking.goals_against || 0);
                          const form = ranking.recent_form || Array(5).fill('').map(() => ['W', 'D', 'L'][Math.floor(Math.random() * 3)]);
                          
                          return (
                            <tr 
                              key={ranking.id} 
                              className="hover:bg-orange-50 transition-colors duration-150 group"
                            >
                              {/* Position */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br ${getPositionColor(index + 1)}`}>
                                  {index + 1}
                                </div>
                              </td>

                              {/* Team */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link 
                                  href={`/viewer/teams/${ranking.team?.id}`}
                                  className="flex items-center space-x-3 group-hover:text-orange-700 transition-colors"
                                >
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                                    {ranking.team?.logo ? (
                                      <Image
                                        src={ranking.team.logo}
                                        alt={ranking.team.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <span className="text-white text-xs font-bold">
                                        {ranking.team?.name?.charAt(0).toUpperCase() || 'T'}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {ranking.team?.name || "Unknown Team"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {ranking.played || 0} matches
                                    </div>
                                  </div>
                                </Link>
                              </td>

                              {/* Stats */}
                              <td className="px-6 py-4 text-center text-gray-900 font-medium">
                                {ranking.played || 0}
                              </td>
                              <td className="px-6 py-4 text-center text-green-600 font-semibold">
                                {ranking.wins || 0}
                              </td>
                              <td className="px-6 py-4 text-center text-yellow-600 font-semibold">
                                {ranking.draws || 0}
                              </td>
                              <td className="px-6 py-4 text-center text-red-600 font-semibold">
                                {ranking.losses || 0}
                              </td>
                              <td className="px-6 py-4 text-center text-gray-900 font-medium">
                                {ranking.goals_for || 0}
                              </td>
                              <td className="px-6 py-4 text-center text-gray-900 font-medium">
                                {ranking.goals_against || 0}
                              </td>
                              <td className="px-6 py-4 text-center font-semibold">
                                <span className={goalDifference > 0 ? "text-green-600" : goalDifference < 0 ? "text-red-600" : "text-gray-600"}>
                                  {goalDifference > 0 ? '+' : ''}{goalDifference}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-3 rounded-lg shadow-sm">
                                  {ranking.points || 0}
                                </div>
                              </td>

                              {/* Form */}
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center space-x-1">
                                  {form.slice(0, 5).map((result, i) => (
                                    <div
                                      key={i}
                                      className={`w-3 h-3 rounded-full ${
                                        result === 'W' ? 'bg-green-500' :
                                        result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      title={result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
                                    />
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))
            )}
          </div>

          {/* Power Rankings Chart */}
          {rankings.length > 0 && (
            <div className="mt-12">
              <PowerRankingChart />
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}