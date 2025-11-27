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
        
        {/* 🔥 HERO SECTION */}
        <section className="relative h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="/img/hero1.jpg"
            alt="Handball action"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
            <motion.div 
              className="max-w-3xl text-white space-y-8"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black leading-tight">
                  Zimbabwe<br />
                  <span className="text-yellow-300">Handball</span><br />
                  <span className="text-4xl md:text-5xl">Hub</span>
                </h1>
                <p className="text-xl md:text-2xl font-light text-yellow-100 max-w-2xl">
                  Your premier destination for handball tournaments, team rankings, and player highlights across Zimbabwe.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/viewer/tournaments"
                  className="group bg-yellow-400 text-orange-900 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FaTrophy className="text-orange-700" />
                  <span>Explore Tournaments</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/viewer/teams"
                  className="group border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-orange-900 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FaUsers />
                  <span>View Teams</span>
                </Link>
              </div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{tournaments.length}</div>
                  <div className="text-yellow-100 text-sm">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{teams.length}</div>
                  <div className="text-yellow-100 text-sm">Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{players.length}</div>
                  <div className="text-yellow-100 text-sm">Players</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-yellow-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-yellow-300 rounded-full mt-2"></div>
            </div>
          </motion.div>
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

        {/* 🔗 Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <Link href="/viewer/home/" className="flex items-center">
                  <Image
                    src="/img/logo.png"
                    alt="Handball 263 Logo"
                    width={55}
                    height={55}
                    className="rounded-md"
                  />
                </Link>
                <p className="text-gray-400 leading-relaxed">
                  The ultimate platform for handball enthusiasts in Zimbabwe. Follow tournaments, track teams, and celebrate the sport.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  {['Tournaments', 'Teams', 'Players', 'News', 'Rankings'].map((link) => (
                    <Link
                      key={link}
                      href={`/viewer/${link.toLowerCase()}`}
                      className="block text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
                <div className="flex space-x-4 mb-6">
                  {[
                    { Icon: FaFacebook, color: 'hover:text-blue-400' },
                    { Icon: FaTwitter, color: 'hover:text-blue-400' },
                    { Icon: FaInstagram, color: 'hover:text-pink-400' },
                    { Icon: FaYoutube, color: 'hover:text-red-500' }
                  ].map(({ Icon, color }, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${color} transition-colors`}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Newsletter</h4>
                <p className="text-gray-400 mb-4">Stay updated with the latest handball news</p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="text-sm flex-1 px-2 py-3 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                  <button className="text-sm px-3 py-3 bg-yellow-400 text-gray-900 font-bold rounded-r-lg hover:bg-yellow-300 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Zimbabwe Handball Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ViewerLayout>
  );
}