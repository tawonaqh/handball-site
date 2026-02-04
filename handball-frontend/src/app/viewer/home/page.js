"use client";

import ViewerLayout from "@/components/ViewerLayout";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import PowerRankingChart from "@/components/PowerRankingChart";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaTrophy, FaNewspaper, FaUsers, FaChartLine, FaPlay, FaArrowRight } from "react-icons/fa";
import { IoStatsChart, IoCalendar, IoPerson } from "react-icons/io5";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const [tournaments, setTournaments] = useState([]);
  const [news, setNews] = useState([]);
  const [ads, setAds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tournamentsData, newsData, adsData, playersData, teamsData] = await Promise.all([
          fetcher("tournaments"),
          fetcher("news"),
          fetcher("ads"),
          fetcher("players"),
          fetcher("teams")
        ]);
        
        setTournaments(tournamentsData);
        setNews(newsData);
        setAds(adsData);
        setPlayers(playersData);
        setTeams(teamsData.sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getCountdown = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    if (diff <= 0) return "Live Now!";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const getTournamentStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "ongoing";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
      <ViewerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Zimbabwe Handball Hub...</p>
          </div>
        </div>
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout>
      <div className="flex flex-col">
        
        {/* 🔥 ENHANCED HERO SECTION */}
        <section className="relative h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 overflow-hidden -mt-20 pt-24">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>

          {/* Enhanced Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-orange-900/30 to-black/60 z-10"></div>
          
          {/* Background Image with Parallax */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src="/img/hero1.jpg"
              alt="Handball action"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Geometric Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-white/10 rotate-45"
              animate={{ rotate: [45, 405] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-yellow-400/20 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"
              animate={{ 
                x: [0, 40, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
            <motion.div 
              className="max-w-4xl text-white space-y-10"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <FaTrophy className="text-yellow-400" size={24} />
                </motion.div>
                <span className="font-bold text-lg">Zimbabwe's Premier Handball Hub</span>
              </motion.div>

              {/* Enhanced Main Title - Adjusted positioning */}
              <div className="space-y-6 mt-8">
                <motion.h1 
                  className="text-6xl md:text-8xl font-black leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className="block">Zimbabwe</span>
                  <span className="block relative">
                    <span className="text-gradient bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Handball
                    </span>
                    {/* Glowing effect */}
                    <span className="absolute inset-0 text-gradient bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent blur-sm opacity-50">
                      Handball
                    </span>
                  </span>
                  <span className="block text-5xl md:text-6xl mt-2">Hub</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-3xl font-light text-yellow-100 max-w-3xl leading-relaxed drop-shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Your premier destination for handball tournaments, team rankings, player highlights, 
                  and the latest news across Zimbabwe's handball community.
                </motion.p>
              </div>
              
              {/* Enhanced Action Buttons - Adjusted spacing */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 pt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Link
                  href="/viewer/tournaments"
                  className="group relative bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-500 transform hover:scale-110 flex items-center justify-center space-x-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <FaTrophy className="relative z-10 text-orange-800 group-hover:rotate-12 transition-transform duration-300" size={24} />
                  <span className="relative z-10">Explore Tournaments</span>
                  <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </Link>
                
                <Link
                  href="/viewer/teams"
                  className="group border-3 border-yellow-400 text-yellow-400 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-yellow-400 hover:text-orange-900 transition-all duration-500 flex items-center justify-center space-x-3 backdrop-blur-sm bg-white/5"
                >
                  <FaUsers className="group-hover:scale-125 transition-transform duration-300" size={24} />
                  <span>View Teams</span>
                  <motion.div
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Link>
              </motion.div>

              {/* Enhanced Quick Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-8 pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                {[
                  { value: tournaments.length, label: "Tournaments", icon: FaTrophy },
                  { value: teams.length, label: "Teams", icon: FaUsers },
                  { value: players.length, label: "Players", icon: IoPerson }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                        <stat.icon className="text-yellow-400 group-hover:text-yellow-300" size={24} />
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-yellow-100 font-medium group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Enhanced Scroll Indicator - Repositioned to avoid button overlap */}
          <motion.div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 text-center"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="w-8 h-14 border-2 border-yellow-300/80 rounded-full flex justify-center backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors cursor-pointer mb-3">
              <motion.div 
                className="w-2 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mt-3"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-yellow-200 text-sm font-medium">Scroll to explore</p>
          </motion.div>

          {/* Enhanced Decorative Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/6 w-40 h-40 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-white/10 to-yellow-300/20 rounded-full blur-2xl"
              animate={{ 
                x: [0, 40, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
        </section>

        <main className="space-y-20 py-20">
          {/* 🏆 Upcoming Tournaments */}
          <section className="container mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                <IoCalendar className="text-orange-600" />
                <span className="font-semibold">Tournaments</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Featured Tournaments
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't miss out on the biggest handball events happening across Zimbabwe
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {tournaments.slice(0, 3).map((tournament) => {
                const status = getTournamentStatus(tournament.start_date, tournament.end_date);
                const statusColors = {
                  upcoming: "bg-blue-100 text-blue-700",
                  ongoing: "bg-green-100 text-green-700",
                  completed: "bg-gray-100 text-gray-700"
                };
                
                return (
                  <motion.div
                    key={tournament.id}
                    variants={itemVariants}
                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-500">
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-2">{tournament.name}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <IoCalendar />
                          <span>
                            {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Countdown</span>
                        <span className="font-bold text-orange-600">{getCountdown(tournament.start_date)}</span>
                      </div>
                      
                      <Link
                        href={`/viewer/tournaments/${tournament.id}`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
                      >
                        <span>View Tournament</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* 📊 Power Rankings */}
          <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
            <div className="container mx-auto px-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full mb-4">
                  <IoStatsChart />
                  <span className="font-semibold">Rankings</span>
                </motion.div>
                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black mb-4">
                  Power Rankings
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-2xl mx-auto">
                  See how your favorite teams stack up against the competition
                </motion.p>
              </motion.div>

              <div className="grid lg:grid-cols-1 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  {teams.slice(0, 5).map((team, index) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl group-hover:text-yellow-300 transition-colors">
                            {team.name}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {team.league?.name || 'Independent'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {team.ranking?.points || 0}
                        </div>
                        <div className="text-sm text-gray-300">points</div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8"
                >
                  <PowerRankingChart teams={teams.slice(0, 8)} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* 🌟 Player Highlights */}
          <section className="container mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                <IoPerson />
                <span className="font-semibold">Players</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Star Players
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
                Meet the athletes making waves in Zimbabwean handball
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {players.slice(0, 6).map((player) => (
                <motion.div
                  key={player.id}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 text-center p-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                      {player.name.charAt(0)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{player.name}</h3>
                  <p className="text-orange-600 font-semibold mb-4">{player.team?.name || "Free Agent"}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{player.goals || 0}</div>
                      <div className="text-sm text-gray-500">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{player.assists || 0}</div>
                      <div className="text-sm text-gray-500">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{player.matches_played || 0}</div>
                      <div className="text-sm text-gray-500">Matches</div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/viewer/players/${player.id}`}
                    className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                  >
                    <span>View Profile</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* 📰 Latest News */}
          <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
            <div className="container mx-auto px-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full mb-4">
                  <FaNewspaper />
                  <span className="font-semibold">News</span>
                </motion.div>
                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  Latest Updates
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Stay informed with the latest handball news and announcements
                </motion.p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {news.slice(0, 3).map((item) => (
                  <motion.article
                    key={item.id}
                    variants={itemVariants}
                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={item.image_url || "/images/news-placeholder.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.content}
                      </p>
                      <Link
                        href={`/viewer/news/${item.id}`}
                        className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                      >
                        <span>Read More</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

      </div>
    </ViewerLayout>
  );
}