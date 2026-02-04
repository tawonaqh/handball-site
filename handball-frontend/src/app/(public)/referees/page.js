"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUserTie, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function RefereesPage() {
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReferees() {
      try {
        const data = await fetcher("referees");
        setReferees(data || []);
      } catch (error) {
        console.error("Error fetching referees:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReferees();
  }, []);

  if (loading) return <LoadingSpinner message="Loading referees..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

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
              <FaUserTie />
              <span className="font-semibold">Referees</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Match Officials
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the certified referees ensuring fair play in handball matches
            </p>
          </motion.div>

          {/* Referees Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {referees.map((referee, index) => (
              <motion.div
                key={referee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 text-center p-8"
              >
                {/* Referee Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    <FaUserTie className="w-8 h-8" />
                  </div>
                  {referee.is_active && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Referee Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {referee.name}
                </h3>
                <p className="text-orange-600 font-semibold mb-4">
                  {referee.certification_level || "Certified Referee"}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{referee.matches_officiated || 0}</div>
                    <div className="text-sm text-gray-500">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{referee.years_experience || 0}</div>
                    <div className="text-sm text-gray-500">Years Exp.</div>
                  </div>
                </div>
                
                {/* Contact Info */}
                {(referee.phone || referee.email) && (
                  <div className="space-y-2 mb-6">
                    {referee.phone && (
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <FaPhone className="w-4 h-4" />
                        <span className="text-sm">{referee.phone}</span>
                      </div>
                    )}
                    {referee.email && (
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <FaEnvelope className="w-4 h-4" />
                        <span className="text-sm">{referee.email}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Specializations */}
                {referee.specializations && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {referee.specializations.split(',').map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {referees.length === 0 && (
            <div className="text-center py-20">
              <FaUserTie className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No referees found</h3>
              <p className="text-gray-500">Check back later for referee information</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}