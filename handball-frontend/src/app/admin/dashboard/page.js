'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  User, 
  Calendar, 
  FileText, 
  Image, 
  Shield, 
  Flag,
  TrendingUp,
  BarChart3,
  Activity,
  Award,
  Newspaper,
  Scale,
  Target,
  Eye,
  Clock,
  Plus
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend, PointElement, LineElement } from "chart.js";
import { fetcher } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend, PointElement, LineElement);

const StatCard = ({ title, value, change, icon: Icon, trend, color = "primary", index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, href, color = "primary", index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color} to-${color}/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch all data in parallel
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
          fetcher("referees"),
        ]);

        // Calculate statistics
        const totalGoals = players.reduce((sum, player) => sum + (player.goals || 0), 0);
        const liveMatches = games.filter(game => game.status === 'live').length;
        const completedMatches = games.filter(game => game.status === 'completed').length;
        const activeReferees = referees.filter(referee => referee.is_active).length;

        setStats({
          tournaments: tournaments.length,
          leagues: leagues.length,
          teams: teams.length,
          players: players.length,
          games: games.length,
          liveMatches,
          completedMatches,
          rankings: rankings.length,
          galleries: galleries.length,
          users: users.length,
          news: news.length,
          referees: referees.length,
          activeReferees,
          totalGoals,
        });

        // Generate recent activity
        const recentItems = [
          ...tournaments.slice(-3).map(t => ({ type: 'Tournament', name: t.name, date: t.created_at, icon: Flag })),
          ...leagues.slice(-3).map(l => ({ type: 'League', name: l.name, date: l.created_at, icon: Trophy })),
          ...teams.slice(-3).map(t => ({ type: 'Team', name: t.name, date: t.created_at, icon: Users })),
          ...games.slice(-3).map(g => ({ type: 'Game', name: `${g.home_team?.name} vs ${g.away_team?.name}`, date: g.created_at, icon: Calendar })),
          ...news.slice(-3).map(n => ({ type: 'News', name: n.title, date: n.created_at, icon: Newspaper })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        setRecentActivity(recentItems);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { title: "Total Tournaments", value: stats.tournaments || 0, icon: Flag, color: "orange-500", change: "+2 this month", trend: "up" },
    { title: "Active Leagues", value: stats.leagues || 0, icon: Trophy, color: "blue-500", change: "+1 this week", trend: "up" },
    { title: "Registered Teams", value: stats.teams || 0, icon: Users, color: "green-500", change: "+5 this month", trend: "up" },
    { title: "Total Players", value: stats.players || 0, icon: User, color: "purple-500", change: "+12 this week", trend: "up" },
    { title: "Scheduled Games", value: stats.games || 0, icon: Calendar, color: "indigo-500", change: "3 today", trend: "neutral" },
    { title: "Live Matches", value: stats.liveMatches || 0, icon: Activity, color: "red-500", change: "2 ongoing", trend: "up" },
    { title: "News Articles", value: stats.news || 0, icon: Newspaper, color: "yellow-500", change: "+3 this week", trend: "up" },
    { title: "Active Referees", value: stats.activeReferees || 0, icon: Scale, color: "teal-500", change: "All available", trend: "neutral" },
  ];

  const quickActions = [
    { title: "Create Tournament", description: "Start a new tournament", icon: Flag, href: "/admin/tournaments/create", color: "orange-500" },
    { title: "Add League", description: "Create a new league", icon: Trophy, href: "/admin/leagues/create", color: "blue-500" },
    { title: "Register Team", description: "Add a new team", icon: Users, href: "/admin/teams/create", color: "green-500" },
    { title: "Add Player", description: "Register new player", icon: User, href: "/admin/players/create", color: "purple-500" },
    { title: "Schedule Game", description: "Create new match", icon: Calendar, href: "/admin/games/create", color: "indigo-500" },
    { title: "Publish News", description: "Write news article", icon: Newspaper, href: "/admin/news/create", color: "yellow-500" },
  ];

  // Chart data
  const gameStatusData = {
    labels: ['Completed', 'Live', 'Scheduled', 'Postponed'],
    datasets: [{
      data: [
        stats.completedMatches || 0,
        stats.liveMatches || 0,
        (stats.games || 0) - (stats.completedMatches || 0) - (stats.liveMatches || 0),
        0
      ],
      backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  const monthlyStatsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Games',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Teams',
        data: [8, 12, 10, 15, 18, 20],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-yellow-400/10 rounded-2xl p-8 border border-border/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your handball league with ease and efficiency
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={action.title} {...action} index={index} />
          ))}
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Status Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <span>Game Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut 
                  data={gameStatusData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Monthly Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  data={monthlyStatsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}