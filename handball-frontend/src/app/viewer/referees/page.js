"use client";

import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { Scale, MapPin, Award, Phone, Mail, Users, Star, Trophy, Calendar, CheckCircle, XCircle, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function RefereesPage() {
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    async function loadReferees() {
      try {
        const data = await fetcher('referees');
        setReferees(data);
      } catch (error) {
        console.error('Error loading referees:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReferees();
  }, []);

  // Filter referees by level
  const filteredReferees = selectedLevel === 'all' 
    ? referees 
    : referees.filter(ref => ref.level?.toLowerCase() === selectedLevel);

  // Group referees by tournament
  const groupedReferees = filteredReferees.reduce((acc, referee) => {
    const tournamentName = referee.tournament?.name || "Independent Officials";
    if (!acc[tournamentName]) acc[tournamentName] = [];
    acc[tournamentName].push(referee);
    return acc;
  }, {});

  // Get unique levels
  const levels = [...new Set(referees.map(ref => ref.level?.toLowerCase()).filter(Boolean))];

  const getLevelConfig = (level) => {
    switch (level?.toLowerCase()) {
      case 'international':
        return {
          gradient: 'from-purple-500 to-pink-500',
          bgGradient: 'from-purple-100 to-pink-100',
          textColor: 'text-purple-700',
          icon: Trophy,
          label: 'International'
        };
      case 'national':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          bgGradient: 'from-blue-100 to-cyan-100',
          textColor: 'text-blue-700',
          icon: Award,
          label: 'National'
        };
      default:
        return {
          gradient: 'from-green-500 to-emerald-500',
          bgGradient: 'from-green-100 to-emerald-100',
          textColor: 'text-green-700',
          icon: Shield,
          label: 'Regional'
        };
    }
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
      <ViewerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading officials...</p>
          </div>
        </div>
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 overflow-hidden -mt-20 pt-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full mb-6">
                <Scale className="text-purple-300" size={20} />
                <span className="font-semibold">Match Officials</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Fair Play <span className="text-purple-300">Guardians</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto mb-8">
                Meet our certified referees who ensure integrity and fairness in every match across all tournaments.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-purple-300 mb-2">{referees.length}</div>
                  <div className="text-blue-100 text-sm md:text-base">Total Officials</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center border-x border-white/20"
                >
                  <div className="text-3xl md:text-4xl font-black text-purple-300 mb-2">
                    {referees.filter(ref => ref.is_active).length}
                  </div>
                  <div className="text-blue-100 text-sm md:text-base">Active</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-purple-300 mb-2">{levels.length}</div>
                  <div className="text-blue-100 text-sm md:text-base">Levels</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="text-gray-500" size={20} />
                <span className="font-semibold text-gray-700">Filter by Level:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedLevel === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Levels ({referees.length})
                </button>
                {levels.map(level => {
                  const config = getLevelConfig(level);
                  const count = referees.filter(ref => ref.level?.toLowerCase() === level).length;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                        selectedLevel === level
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                          : `bg-gradient-to-r ${config.bgGradient} ${config.textColor} hover:shadow-md`
                      }`}
                    >
                      <config.icon size={16} />
                      <span>{config.label} ({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Referees Content */}
          {filteredReferees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="text-6xl mb-6">⚖️</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                {referees.length === 0 ? 'No Officials Available' : 'No Officials Found'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {referees.length === 0 
                  ? 'There are currently no referees registered in the system.'
                  : 'No officials match the selected level filter.'
                }
              </p>
              {referees.length > 0 && (
                <button
                  onClick={() => setSelectedLevel('all')}
                  className="btn-primary"
                >
                  Show All Officials
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedReferees).map(([tournament, tournamentReferees]) => (
                <motion.section
                  key={tournament}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >
                  {/* Tournament Header */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{tournament}</h2>
                        <p className="text-blue-100 font-medium">
                          {tournamentReferees.length} {tournamentReferees.length === 1 ? 'Official' : 'Officials'}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Scale className="text-white" size={24} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Referees Grid */}
                  <div className="p-8">
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {tournamentReferees.map((referee, index) => {
                        const levelConfig = getLevelConfig(referee.level);
                        return (
                          <motion.div
                            key={referee.id}
                            variants={itemVariants}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                          >
                            {/* Referee Header */}
                            <div className="text-center mb-6">
                              <div className={`w-20 h-20 bg-gradient-to-br ${levelConfig.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <levelConfig.icon className="text-white" size={32} />
                              </div>
                              <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors">
                                {referee.name}
                              </h3>
                              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${levelConfig.gradient} shadow-md`}>
                                <levelConfig.icon size={14} />
                                <span>{levelConfig.label}</span>
                              </span>
                            </div>

                            {/* Referee Details */}
                            <div className="space-y-3 mb-6">
                              {referee.license_number && (
                                <div className="flex items-center space-x-3 text-sm">
                                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Award size={16} className="text-yellow-600" />
                                  </div>
                                  <div>
                                    <span className="text-gray-500">License:</span>
                                    <span className="font-semibold text-gray-800 ml-1">{referee.license_number}</span>
                                  </div>
                                </div>
                              )}
                              
                              {referee.email && (
                                <div className="flex items-center space-x-3 text-sm">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail size={16} className="text-blue-600" />
                                  </div>
                                  <span className="text-gray-600 truncate">{referee.email}</span>
                                </div>
                              )}
                              
                              {referee.phone && (
                                <div className="flex items-center space-x-3 text-sm">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Phone size={16} className="text-green-600" />
                                  </div>
                                  <span className="text-gray-600">{referee.phone}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-3 text-sm">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                  <MapPin size={16} className="text-red-600" />
                                </div>
                                <span className="text-gray-600">{referee.tournament?.name || 'Independent'}</span>
                              </div>
                            </div>

                            {/* Status and Stats */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                {referee.is_active ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <XCircle size={16} className="text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${referee.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                  {referee.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar size={14} />
                                <span>{referee.games_count || 0} matches</span>
                              </div>
                            </div>

                            {/* Experience Level */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Experience Level</span>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={12}
                                      className={`${
                                        star <= (referee.experience_level || 3)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.section>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {filteredReferees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Interested in Officiating?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join our team of certified referees and help maintain the highest standards of fair play in handball.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Award size={20} />
                  <span>Become a Referee</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Mail size={20} />
                  <span>Contact Officials</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}