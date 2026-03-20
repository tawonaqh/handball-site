import { motion } from "framer-motion";
import Link from "next/link";
import { IoCalendar, IoTrophy } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

export default function TournamentCard({ tournament }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 w-full"
    >
      {/* Header with gradient */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-4 right-8 w-12 h-12 border border-white rounded-lg rotate-45 animate-bounce" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full opacity-50 animate-ping" />
        </div>

        {/* Tournament info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors truncate pr-2">
              {tournament.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                tournament.gender === 'women'
                  ? 'bg-pink-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {tournament.gender === 'women' ? 'Women' : 'Men'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                tournament.type === 'knockout'
                  ? 'bg-purple-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}>
                {tournament.type === 'knockout' ? 'Knockout' : 'League'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-white/90 text-sm">
            <div className="flex items-center space-x-1">
              <IoCalendar className="w-4 h-4" />
              <span>{tournament.season || "Current Season"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {tournament.teams?.length || 0}
              {tournament.max_teams && (
                <span className="text-base text-gray-400">/{tournament.max_teams}</span>
              )}
            </div>
            <div className="text-sm text-gray-500">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {tournament.matches_count || tournament.games?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Matches</div>
          </div>
        </div>

        {/* Knockout info */}
        {tournament.type === 'knockout' && tournament.num_groups && (
          <div className="bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
            <div className="flex items-center justify-between text-xs text-purple-700">
              <span className="font-semibold">{tournament.num_groups} Groups</span>
              {tournament.teams_per_group && (
                <span>{tournament.teams_per_group} teams each</span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {tournament.description && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-2">
            {tournament.description}
          </p>
        )}
        
        {/* Action button */}
        <Link
          href={`/tournaments/${tournament.id}`}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <IoTrophy className="w-4 h-4" />
          <span>View Tournament</span>
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
