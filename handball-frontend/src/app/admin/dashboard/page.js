'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  User, 
  Calendar, 
  Flag,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Newspaper,
  Scale,
  Target,
  ArrowUpRight,
  Zap,
  PlayCircle,
  Clock,
  Shield
} from "lucide-react";
import { fetcher } from "@/lib/api";
import Link from "next/link";

const StatCard = ({ title, value, change, icon: Icon, trend, color = "orange", index = 0, href }) => {
  const colorClasses = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600", 
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    indigo: "from-indigo-500 to-indigo-600",
    teal: "from-teal-500 to-teal-600"
  };

  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group hover:border-gray-600/50 transition-all duration-300 overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-10 translate-x-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {href && (
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
          {change && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return href ? (
    <Link href={href} className="block">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

const QuickActionCard = ({ title, description, icon: Icon, href, color = "orange", index = 0 }) => {
  const colorClasses = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600", 
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    indigo: "from-indigo-500 to-indigo-600",
    teal: "from-teal-500 to-teal-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group hover:border-gray-600/50 transition-all duration-300 cursor-pointer overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {description}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch all data in parallel
        const [tournaments, leagues, teams, players, games, rankings, galleries, users, news, referees] = await Promise.all([
          fetcher("tournaments").catch(() => []),
          fetcher("leagues").catch(() => []),
          fetcher("teams").catch(() => []),
          fetcher("players").catch(() => []),
          fetcher("games").catch(() => []),
          fetcher("rankings").catch(() => []),
          fetcher("galleries").catch(() => []),
          fetcher("users").catch(() => []),
          fetcher("news").catch(() => []),
          fetcher("referees").catch(() => []),
        ]);

        // Calculate statistics
        const liveMatches = games.filter(game => game.status === 'live').length;
        const activeReferees = referees.filter(referee => referee.is_active).length;

        setStats({
          tournaments: tournaments.length,
          leagues: leagues.length,
          teams: teams.length,
          players: players.length,
          games: games.length,
          liveMatches,
          news: news.length,
          activeReferees,
        });

        // Generate recent activity
        const recentItems = [
          ...tournaments.slice(-3).map(t => ({ type: 'Tournament', name: t.name, date: t.created_at || new Date(), icon: Flag })),
          ...leagues.slice(-3).map(l => ({ type: 'League', name: l.name, date: l.created_at || new Date(), icon: Trophy })),
          ...teams.slice(-3).map(t => ({ type: 'Team', name: t.name, date: t.created_at || new Date(), icon: Users })),
          ...games.slice(-3).map(g => ({ type: 'Game', name: `${g.home_team?.name || 'Team A'} vs ${g.away_team?.name || 'Team B'}`, date: g.created_at || new Date(), icon: Calendar })),
          ...news.slice(-3).map(n => ({ type: 'News', name: n.title, date: n.created_at || new Date(), icon: Newspaper })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

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
    { title: "Total Tournaments", value: stats.tournaments || 0, icon: Flag, color: "orange", change: "+2 this month", trend: "up", href: "/admin/tournaments" },
    { title: "Active Leagues", value: stats.leagues || 0, icon: Trophy, color: "blue", change: "+1 this week", trend: "up", href: "/admin/leagues" },
    { title: "Registered Teams", value: stats.teams || 0, icon: Users, color: "green", change: "+5 this month", trend: "up", href: "/admin/teams" },
    { title: "Total Players", value: stats.players || 0, icon: User, color: "purple", change: "+12 this week", trend: "up", href: "/admin/players" },
    { title: "Scheduled Games", value: stats.games || 0, icon: Calendar, color: "indigo", change: "3 today", trend: "neutral", href: "/admin/games" },
    { title: "Live Matches", value: stats.liveMatches || 0, icon: PlayCircle, color: "red", change: "2 ongoing", trend: "up" },
    { title: "News Articles", value: stats.news || 0, icon: Newspaper, color: "yellow", change: "+3 this week", trend: "up", href: "/admin/news" },
    { title: "Active Referees", value: stats.activeReferees || 0, icon: Scale, color: "teal", change: "All available", trend: "neutral", href: "/admin/referees" },
  ];

  const quickActions = [
    { title: "Create Tournament", description: "Start a new tournament", icon: Flag, href: "/admin/tournaments/create", color: "orange" },
    { title: "Add League", description: "Create a new league", icon: Trophy, href: "/admin/leagues/create", color: "blue" },
    { title: "Register Team", description: "Add a new team", icon: Users, href: "/admin/teams/create", color: "green" },
    { title: "Add Player", description: "Register new player", icon: User, href: "/admin/players/create", color: "purple" },
    { title: "Schedule Game", description: "Create new match", icon: Calendar, href: "/admin/games/create", color: "indigo" },
    { title: "Publish News", description: "Write news article", icon: Newspaper, href: "/admin/news/create", color: "yellow" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full translate-y-16 -translate-x-16" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2"
            >
              Welcome Back, Admin! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-lg"
            >
              Manage your handball league with style and efficiency
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4 mt-4"
            >
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <Zap className="w-4 h-4" />
                <span>System Online</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white mb-6 flex items-center space-x-2"
        >
          <BarChart3 className="w-6 h-6 text-orange-500" />
          <span>Overview Statistics</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white mb-6 flex items-center space-x-2"
        >
          <Zap className="w-6 h-6 text-orange-500" />
          <span>Quick Actions</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={action.title} {...action} index={index} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <span>Recent Activity</span>
          </h3>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-700/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/20">
                  <activity.icon className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-gray-100 transition-colors">
                    {activity.name}
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {activity.type} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-orange-500 opacity-60" />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}