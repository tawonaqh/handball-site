import { motion } from "framer-motion";
import Link from "next/link";
import { IoCalendar, IoTrophy, IoLocation } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

export default function TournamentCard({ tournament }) {
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
    
    if (now < start) return { status: "upcoming", color: "bg-blue-500" };
    if (now > end) return { status: "completed", color: "bg-gray-500" };
    return { status: "live", color: "bg-green-500" };
  };

  const { status, color } = getTournamentStatus(tournament.start_date, tournament.end_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Header with gradient */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 overflow-hidden">
        {/* Status badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-4 right-8 w-12 h-12 border border-white rounded-lg rotate-45 animate-bounce" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full opacity-50 animate-ping" />
        </div>

        {/* Tournament info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
            {tournament.name}
          </h3>
          <div className="flex items-center space-x-4 text-white/90 text-sm">
            <div className="flex items-center space-x-1">
              <IoCalendar className="w-4 h-4" />
              <span>
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </span>
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
              {tournament.teams_count || 0}
            </div>
            <div className="text-sm text-gray-500">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {getCountdown(tournament.start_date)}
            </div>
            <div className="text-sm text-gray-500">
              {status === 'live' ? 'Live Now' : status === 'completed' ? 'Finished' : 'Starts In'}
            </div>
          </div>
        </div>

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