import { motion } from "framer-motion";
import { FaTrophy, FaUsers } from "react-icons/fa";

export default function TournamentStructure({ tournament, standings = [] }) {
  // Group teams by their groups for knockout tournaments
  const groupedTeams = {};
  
  if (tournament.type === 'knockout' && tournament.teams) {
    tournament.teams.forEach((team, index) => {
      const groupIndex = Math.floor(index / (tournament.teams_per_group || 4));
      const groupName = String.fromCharCode(65 + groupIndex); // A, B, C, D...
      
      if (!groupedTeams[groupName]) {
        groupedTeams[groupName] = [];
      }
      groupedTeams[groupName].push(team);
    });
  }

  // League type - show standings table
  if (tournament.type === 'league' || tournament.type !== 'knockout') {
    if (standings.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <FaTrophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No standings available yet</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FaTrophy />
            <span>League Standings</span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Team</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">P</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">W</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">L</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((standing, index) => (
                <tr key={standing.team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {standing.rank || index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{standing.team.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900">{standing.gamesPlayed || 0}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">{standing.wins || 0}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">{standing.losses || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xl font-bold text-orange-600">{standing.points || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  // Knockout type - show groups
  if (Object.keys(groupedTeams).length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No teams assigned to groups yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <FaTrophy />
          <span>Group Stage</span>
        </h2>
        <p className="text-purple-100 mt-2">
          {Object.keys(groupedTeams).length} groups competing for knockout stage qualification
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedTeams).map(([groupName, teams]) => (
          <motion.div
            key={groupName}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <h3 className="text-xl font-bold text-white">Group {groupName}</h3>
            </div>
            <div className="p-4 space-y-2">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{team.name}</p>
                  </div>
                </div>
              ))}
              {teams.length < (tournament.teams_per_group || 4) && (
                <div className="text-center py-3 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  {(tournament.teams_per_group || 4) - teams.length} spots remaining
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Show empty groups if configured */}
        {tournament.num_groups > Object.keys(groupedTeams).length && 
          Array.from({ length: tournament.num_groups - Object.keys(groupedTeams).length }).map((_, index) => {
            const groupName = String.fromCharCode(65 + Object.keys(groupedTeams).length + index);
            return (
              <motion.div
                key={groupName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 border-dashed"
              >
                <div className="bg-gray-100 p-4">
                  <h3 className="text-xl font-bold text-gray-400">Group {groupName}</h3>
                </div>
                <div className="p-4">
                  <div className="text-center py-8 text-gray-400">
                    <FaUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No teams assigned</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        }
      </div>

      {tournament.knockout_rounds && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-orange-200">
          <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
            <FaTrophy className="text-orange-600" />
            Knockout Stage
          </h3>
          <p className="text-orange-700">
            Top teams from each group will advance to the{' '}
            <span className="font-semibold capitalize">
              {tournament.knockout_rounds.replace(/_/g, ' ')}
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
