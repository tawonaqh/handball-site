import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

export default function RankingChart({ teams }) {
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-8">
        <FaTrophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No ranking data available</p>
      </div>
    );
  }

  const maxPoints = Math.max(...teams.map(team => team.ranking?.points || 0));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">Team Performance Chart</h3>
      
      {teams.map((team, index) => {
        const points = team.ranking?.points || 0;
        const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
        
        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Team info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{team.name}</span>
              </div>
              <span className="text-yellow-400 font-bold">{points} pts</span>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}