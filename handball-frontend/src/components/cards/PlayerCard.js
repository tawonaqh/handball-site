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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Player Photo */}
      <div className="relative h-64 bg-gradient-to-br from-orange-500 to-yellow-500 overflow-hidden">
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaUser className="w-20 h-20 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Jersey Number Badge */}
        {player.jersey_number && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">#{player.jersey_number}</span>
            </div>
          </div>
        )}
        
        {/* Player Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {player.name}
          </h3>
          <p className="text-white/90 font-semibold">
            {player.position || "Player"}
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-orange-600 font-semibold mb-4 text-center">
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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
        >
          <span>View Profile</span>
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}