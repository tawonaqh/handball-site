"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser, FaCalendar, FaFlag } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { MdSportsHandball } from "react-icons/md";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function RefereeDetailPage() {
  const params = useParams();
  const refereeId = params.id;
  const [referee, setReferee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const refereeData = await fetcher(`referees/${refereeId}`);
        setReferee(refereeData);
      } catch (error) {
        console.error("Error fetching referee:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [refereeId]);

  if (loading) return <LoadingSpinner message="Loading referee profile..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;
  if (!referee) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Referee not found</p>
          <Link href="/referees" className="text-orange-500 hover:underline">
            Back to Referees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full animate-pulse" />
                <div className="absolute bottom-4 right-8 w-24 h-24 border border-white rounded-lg rotate-45" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUser className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Referee Profile</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{referee.name}</h1>
                <div className="flex flex-wrap gap-4 text-lg">
                  {referee.certification_level && (
                    <span className="bg-white/20 px-4 py-2 rounded-full">{referee.certification_level}</span>
                  )}
                  {referee.experience_years && (
                    <span className="bg-white/20 px-4 py-2 rounded-full">{referee.experience_years} years experience</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <MdSportsHandball className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {referee.matches_officiated || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Matches</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaCalendar className="w-8 h-8 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">
                  {referee.experience_years || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Years</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <FaFlag className="w-8 h-8 text-orange-500" />
                <span className="text-lg font-bold text-gray-900 capitalize">
                  {referee.certification_level || 'N/A'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Level</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <IoStatsChart className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {referee.rating || 'N/A'}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">Rating</h3>
            </motion.div>
          </div>

          {/* Referee Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Referee Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {referee.email && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{referee.email}</p>
                </div>
              )}
              {referee.phone && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{referee.phone}</p>
                </div>
              )}
              {referee.nationality && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nationality</p>
                  <p className="text-lg font-semibold text-gray-900">{referee.nationality}</p>
                </div>
              )}
              {referee.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(referee.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}
              {referee.certification_date && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Certified Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(referee.certification_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {referee.languages && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Languages</p>
                  <p className="text-lg font-semibold text-gray-900">{referee.languages}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bio */}
          {referee.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
              <p className="text-gray-600 leading-relaxed">{referee.bio}</p>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
