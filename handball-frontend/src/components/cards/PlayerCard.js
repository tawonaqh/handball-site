import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaUser } from "react-icons/fa";

export default function PlayerCard({ player }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 text-center p-8"
    >
      {/* Player Avatar */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          {player.name ? player.name.charAt(0).toUpperCase() : <FaUser />}
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Player Info */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
        {player.name}
      </h3>
      <p className="text-orange-600 font-semibold mb-6">
        {player.team?.name || "Free Agent"}
      </p>
      
      {/* Stats */}
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
      
      {/* Action Link */}
      <Link
        href={`/players/${player.id}`}
        className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
      >
        <span>View Profile</span>
        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}