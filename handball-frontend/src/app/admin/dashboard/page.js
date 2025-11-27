'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  User, 
  Calendar, 
  FileText, 
  Image, 
  Shield, 
  AlertCircle,
  Flag,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Award,
  Target,
  Newspaper,
  Scale // Added Scale icon for referees
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend } from "chart.js";
import { fetcher } from "@/lib/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch all data in parallel - ADDED REFEREES
        const [tournaments, leagues, teams, players, games, rankings, galleries, users, news, referees] = await Promise.all([
          fetcher("tournaments"),
          fetcher("leagues"),
          fetcher("teams"),
          fetcher("players"),
          fetcher("games"),
          fetcher("rankings"),
          fetcher("galleries"),
          fetcher("users"),
          fetcher("news"),
          fetcher("referees"), // ADDED REFEREES FETCH
        ]);

        // Calculate system-wide statistics
        const totalGoals = players.reduce((sum, player) => sum + (player.goals || 0), 0);
        const totalMatches = games.length;
        const completedMatches = games.filter(game => game.status === 'completed').length;
        const liveMatches = games.filter(game => game.status === 'live').length;
        const totalPoints = rankings.reduce((sum, ranking) => sum + (ranking.points || 0), 0);
        const activeReferees = referees.filter(referee => referee.is_active).length;
        
        // Find top teams by points
        const topTeams = [...rankings]
          .sort((a, b) => (b.points || 0) - (a.points || 0))
          .slice(0, 3)
          .map(ranking => ({
            name: ranking.team?.name || 'Unknown Team',
            points: ranking.points || 0,
            wins: ranking.wins || 0
          }));

        // Calculate game status distribution
        const gameStatuses = {
          scheduled: games.filter(g => g.status === 'scheduled').length,
          live: games.filter(g => g.status === 'live').length,
          completed: games.filter(g => g.status === 'completed').length,
          postponed: games.filter(g => g.status === 'postponed').length,
          cancelled: games.filter(g => g.status === 'cancelled').length
        };

        // Generate recent activity (last 7 days of creations) - ADDED REFEREES
        const recentItems = [
          ...tournaments.map(t => ({ type: 'Tournament', name: t.name, date: t.created_at, icon: Flag })),
          ...leagues.map(l => ({ type: 'League', name: l.name, date: l.created_at, icon: Trophy })),
          ...teams.map(t => ({ type: 'Team', name: t.name, date: t.created_at, icon: Users })),
          ...games.map(g => ({ 
            type: 'Game', 
            name: `${g.home_team?.name || 'Home'} vs ${g.away_team?.name || 'Away'}`, 
            date: g.created_at, 
            icon: Calendar 
          })),
          ...news.map(n => ({ 
            type: 'News', 
            name: n.title, 
            date: n.created_at, 
            icon: Newspaper 
          })),
          ...referees.map(r => ({ // ADDED REFEREES TO RECENT ACTIVITY
            type: 'Referee', 
            name: r.name, 
            date: r.created_at, 
            icon: Scale 
          }))
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 8);

        // Helper to calculate daily counts for last 7 days
        const generateTrend = (items) => {
          const trend = [];
          const labels = [];
          for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(day.getDate() - i);
            const dayStr = day.toISOString().split("T")[0];
            const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dayLabel);
            const count = items.filter(item => item.created_at.startsWith(dayStr)).length;
            trend.push(count);
          }
          return { trend, labels };
        };

        const statsData = [
          { 
            name: "Tournaments", 
            items: tournaments, 
            icon: <Flag size={28} className="text-orange-500" />, 
            link: "/admin/tournaments", 
            color: 'rgba(249, 115, 22, 0.8)',
            description: "Active competitions"
          },
          { 
            name: "Leagues", 
            items: leagues, 
            icon: <Trophy size={28} className="text-yellow-500" />, 
            link: "/admin/leagues", 
            color: 'rgba(245, 158, 11, 0.8)',
            description: "Tournament divisions"
          },
          { 
            name: "Teams", 
            items: teams, 
            icon: <Users size={28} className="text-green-500" />, 
            link: "/admin/teams", 
            color: 'rgba(34, 197, 94, 0.8)',
            description: "Registered teams"
          },
          { 
            name: "Players", 
            items: players, 
            icon: <User size={28} className="text-purple-500" />, 
            link: "/admin/players", 
            color: 'rgba(139, 92, 246, 0.8)',
            description: "Team members"
          },
          { 
            name: "Referees", // ADDED REFEREES STAT CARD
            items: referees, 
            icon: <Scale size={28} className="text-indigo-500" />, 
            link: "/admin/referees", 
            color: 'rgba(79, 70, 229, 0.8)',
            description: "Match officials"
          },
          { 
            name: "Games", 
            items: games, 
            icon: <Calendar size={28} className="text-red-500" />, 
            link: "/admin/games", 
            color: 'rgba(239, 68, 68, 0.8)',
            description: "Scheduled matches"
          },
          { 
            name: "Rankings", 
            items: rankings, 
            icon: <FileText size={28} className="text-pink-500" />, 
            link: "/admin/rankings", 
            color: 'rgba(236, 72, 153, 0.8)',
            description: "Team standings"
          },
          { 
            name: "Gallery", 
            items: galleries, 
            icon: <Image size={28} className="text-amber-500" />, 
            link: "/admin/galleries", 
            color: 'rgba(245, 158, 11, 0.8)',
            description: "Media content"
          },
          { 
            name: "News", 
            items: news, 
            icon: <Newspaper size={28} className="text-blue-500" />, 
            link: "/admin/news", 
            color: 'rgba(59, 130, 246, 0.8)',
            description: "News articles"
          },
          { 
            name: "Users", 
            items: users, 
            icon: <Shield size={28} className="text-teal-500" />, 
            link: "/admin/users", 
            color: 'rgba(20, 184, 166, 0.8)',
            description: "System users"
          },
        ];

        setStats(statsData.map(s => ({
          ...s,
          count: s.items.length,
          ...generateTrend(s.items)
        })));

        setSystemStats({
          totalGoals,
          totalMatches,
          completedMatches,
          liveMatches,
          totalPoints,
          topTeams,
          gameStatuses,
          totalNews: news.length,
          totalReferees: referees.length,
          activeReferees
        });

        setRecentActivity(recentItems);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-600 text-white p-8 rounded-b-3xl shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-extrabold mb-4">Admin Dashboard</h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Comprehensive overview of your sports management system. Track performance, monitor activity, and manage all aspects in one place.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Activity className="text-white" size={32} />
              <div>
                <div className="text-2xl font-bold">{systemStats.totalMatches || 0}</div>
                <div className="text-gray-200">Total Matches</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-6 space-y-8 -mt-8">
        {/* Key Metrics Overview - ADDED REFEREES METRIC */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Goals</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalGoals || 0}</p>
              </div>
              <Target className="text-blue-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              Across all matches
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Matches</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.completedMatches || 0}</p>
              </div>
              <Award className="text-green-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {systemStats.totalMatches ? Math.round((systemStats.completedMatches / systemStats.totalMatches) * 100) : 0}% of total
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Live Matches</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.liveMatches || 0}</p>
              </div>
              <Activity className="text-purple-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Currently active
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalPoints || 0}</p>
              </div>
              <BarChart3 className="text-yellow-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Across all rankings
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">News Articles</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalNews || 0}</p>
              </div>
              <Newspaper className="text-cyan-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Published updates
            </div>
          </div>

          {/* ADDED REFEREES METRIC CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Referees</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.activeReferees || 0}</p>
              </div>
              <Scale className="text-indigo-500" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              of {systemStats.totalReferees || 0} total
            </div>
          </div>
        </section>

        {/* Main Stats Grid - NOW 3x4 GRID */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="mr-3 text-indigo-600" size={28} />
            System Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div 
                key={stat.name} 
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between border ${
                  stat.count === 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{stat.name}</h3>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                  {stat.count === 0 ? (
                    <AlertCircle className="text-red-500" size={28} />
                  ) : (
                    <div className="p-2 rounded-lg bg-gray-50">
                      {stat.icon}
                    </div>
                  )}
                </div>

                <p className={`text-4xl font-bold mb-4 ${stat.count === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                  {stat.count}
                </p>

                {/* Mini trend chart */}
                <div className="mt-2 h-16">
                  <Bar
                    data={{
                      labels: stat.labels,
                      datasets: [{ 
                        label: 'Daily Activity', 
                        data: stat.trend, 
                        backgroundColor: stat.color,
                        borderRadius: 4,
                        borderSkipped: false,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { 
                        legend: { display: false }, 
                        tooltip: { 
                          enabled: true,
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white'
                        } 
                      },
                      scales: { 
                        x: { 
                          display: true,
                          grid: { display: false },
                          ticks: { color: '#6B7280', font: { size: 10 } }
                        }, 
                        y: { 
                          display: false,
                          grid: { display: false }
                        } 
                      },
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link 
                    href={stat.link} 
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center group"
                  >
                    Manage
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  {stat.count === 0 && (
                    <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                      Setup needed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section with Charts and Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Status Distribution */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="mr-2 text-green-500" size={20} />
              Match Status
            </h3>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Scheduled', 'Live', 'Completed', 'Postponed', 'Cancelled'],
                  datasets: [{
                    data: [
                      systemStats.gameStatuses?.scheduled || 0,
                      systemStats.gameStatuses?.live || 0,
                      systemStats.gameStatuses?.completed || 0,
                      systemStats.gameStatuses?.postponed || 0,
                      systemStats.gameStatuses?.cancelled || 0
                    ],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(107, 114, 128, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: 'white'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  },
                  cutout: '60%'
                }}
              />
            </div>
          </div>

          {/* Top Teams */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Trophy className="mr-2 text-yellow-500" size={20} />
              Top Teams
            </h3>
            <div className="space-y-4">
              {systemStats.topTeams && systemStats.topTeams.length > 0 ? (
                systemStats.topTeams.map((team, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium text-gray-800">{team.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{team.points} pts</div>
                      <div className="text-sm text-gray-500">{team.wins} wins</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="mx-auto mb-2 text-gray-300" size={32} />
                  <p>No ranking data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2 text-indigo-500" size={20} />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                        <p className="text-xs text-gray-500">{activity.type}</p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="mx-auto mb-2 text-gray-300" size={32} />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}