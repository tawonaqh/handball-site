"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaTrophy, FaNewspaper, FaUsers, FaArrowRight } from "react-icons/fa";
import { IoStatsChart, IoCalendar, IoPerson } from "react-icons/io5";
import Image from "next/image";

// Components
import HeroSection from "@/components/sections/HeroSection";
import TournamentCard from "@/components/cards/TournamentCard";
import PlayerCard from "@/components/cards/PlayerCard";
import NewsCard from "@/components/cards/NewsCard";
import RankingChart from "@/components/charts/RankingChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function HomePage() {
  const [data, setData] = useState({
    tournaments: [],
    news: [],
    players: [],
    teams: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [tournaments, news, players, teams] = await Promise.all([
          fetcher("tournaments"),
          fetcher("news"),
          fetcher("players"),
          fetcher("teams")
        ]);
        
        setData({
          tournaments: tournaments || [],
          news: news || [],
          players: players || [],
          teams: teams?.sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0)) || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }
    
    fetchData();
  }, []);

  if (data.loading) {
    return <LoadingSpinner message="Loading Handball 263..." />;
  }

  if (data.error) {
    return (
      <ErrorBoundary 
        error={data.error} 
        retry={() => window.location.reload()} 
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="space-y-24 py-20">
          
          {/* Featured Tournaments */}
          <section className="container mx-auto px-6">
            <SectionHeader
              badge="Tournaments"
              icon={<IoCalendar />}
              title="Featured Tournaments"
              description="Don't miss out on the biggest handball events happening across Zimbabwe"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.tournaments.slice(0, 3).map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
            
            {data.tournaments.length > 3 && (
              <div className="text-center mt-12">
                <Link
                  href="/tournaments"
                  className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <span>View All Tournaments</span>
                  <FaArrowRight />
                </Link>
              </div>
            )}
          </section>

          {/* Power Rankings */}
          <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
            <div className="container mx-auto px-6">
              <SectionHeader
                badge="Rankings"
                icon={<IoStatsChart />}
                title="Power Rankings"
                description="See how your favorite teams stack up against the competition"
                dark
              />
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {data.teams.slice(0, 5).map((team, index) => (
                    <RankingItem key={team.id} team={team} position={index + 1} />
                  ))}
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                  <RankingChart teams={data.teams.slice(0, 8)} />
                </div>
              </div>
            </div>
          </section>

          {/* Star Players */}
          <section className="container mx-auto px-6">
            <SectionHeader
              badge="Players"
              icon={<IoPerson />}
              title="Star Players"
              description="Meet the athletes making waves in Zimbabwean handball"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.players.slice(0, 6).map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>

          {/* Latest News */}
          <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
            <div className="container mx-auto px-6">
              <SectionHeader
                badge="News"
                icon={<FaNewspaper />}
                title="Latest Updates"
                description="Stay informed with the latest handball news and announcements"
              />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.news.slice(0, 3).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper Components
function SectionHeader({ badge, icon, title, description, dark = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <motion.div 
        variants={itemVariants} 
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${
          dark 
            ? 'bg-orange-500 text-white' 
            : 'bg-orange-100 text-orange-700'
        }`}
      >
        {icon}
        <span className="font-semibold">{badge}</span>
      </motion.div>
      
      <motion.h2 
        variants={itemVariants} 
        className={`text-4xl md:text-5xl font-black mb-4 ${
          dark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </motion.h2>
      
      <motion.p 
        variants={itemVariants} 
        className={`text-xl max-w-2xl mx-auto ${
          dark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

function RankingItem({ team, position }) {
  const getBadgeColor = (pos) => {
    if (pos === 1) return 'bg-yellow-500';
    if (pos === 2) return 'bg-gray-400';
    if (pos === 3) return 'bg-orange-500';
    return 'bg-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: position * 0.1 }}
      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${getBadgeColor(position)}`}>
          {position}
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
    </motion.div>
  );
}