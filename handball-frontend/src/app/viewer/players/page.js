import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function PlayersPage() {
  const players = await fetcher("players");

  // Group players by tournament → league → team
  const grouped = {};
  players.forEach((p) => {
    const tournament = p.team?.league?.tournament?.name || "Independent Players";
    const league = p.team?.league?.name || "Unassigned League";
    const team = p.team?.name || "Unassigned Team";

    if (!grouped[tournament]) grouped[tournament] = {};
    if (!grouped[tournament][league]) grouped[tournament][league] = {};
    if (!grouped[tournament][league][team]) grouped[tournament][league][team] = [];

    grouped[tournament][league][team].push(p);
  });

  // Calculate statistics
  const totalPlayers = players.length;
  const totalTeams = new Set(players.map(p => p.team?.id).filter(Boolean)).size;
  const totalLeagues = new Set(players.map(p => p.team?.league?.id).filter(Boolean)).size;
  const totalTournaments = Object.keys(grouped).length;

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Handball Players
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Discover talented players across all tournaments, leagues, and teams
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {totalPlayers}
                </div>
                <div className="text-sm text-gray-600 font-medium">Players</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {totalTeams}
                </div>
                <div className="text-sm text-gray-600 font-medium">Teams</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {totalLeagues}
                </div>
                <div className="text-sm text-gray-600 font-medium">Leagues</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {totalTournaments}
                </div>
                <div className="text-sm text-gray-600 font-medium">Tournaments</div>
              </div>
            </div>
          </div>

          {/* Players Organization */}
          <div className="space-y-12">
            {Object.entries(grouped).map(([tournament, leagues]) => (
              <section key={tournament} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {tournament}
                      </h2>
                      <p className="text-orange-100 font-medium">
                        {Object.values(leagues).reduce((total, teams) => 
                          total + Object.values(teams).reduce((sum, players) => sum + players.length, 0), 0
                        )} Players
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                  </div>
                </div>

                {/* Leagues and Teams */}
                <div className="p-8 space-y-8">
                  {Object.entries(leagues).map(([league, teams]) => (
                    <div key={league} className="space-y-6">
                      {/* League Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">
                          {league}
                        </h3>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {Object.values(teams).reduce((sum, players) => sum + players.length, 0)} players
                        </span>
                      </div>

                      {/* Teams Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(teams).map(([team, teamPlayers]) => (
                          <div
                            key={team}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                          >
                            {/* Team Header */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                              <h4 className="text-lg font-bold text-gray-900">
                                {team}
                              </h4>
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                                {teamPlayers.length} players
                              </span>
                            </div>

                            {/* Players List */}
                            <div className="grid gap-3">
                              {teamPlayers.map((player) => (
                                <Link
                                  key={player.id}
                                  href={`/viewer/players/${player.id}`}
                                  className="group flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-orange-50 transition-all duration-200 border border-gray-100 hover:border-orange-200 hover:shadow-md"
                                >
                                  {/* Player Avatar */}
                                  <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                      {player.photo ? (
                                        <Image
                                          src={player.photo}
                                          alt={player.name}
                                          width={32}
                                          height={32}
                                          className="rounded-full"
                                        />
                                      ) : (
                                        <span className="text-white font-bold text-sm">
                                          {player.name.charAt(0).toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Player Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors truncate">
                                        {player.name}
                                      </span>
                                      {player.jersey_number && (
                                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs font-bold">
                                          #{player.jersey_number}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      {player.position && (
                                        <span className="text-sm text-orange-600 font-medium">
                                          {player.position}
                                        </span>
                                      )}
                                      {player.age && (
                                        <span className="text-sm text-gray-500">
                                          • {player.age} years
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Arrow Indicator */}
                                  <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                                    →
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {players.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Players Available</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no players registered in the system. Check back later for updates!
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mt-6 rounded-full"></div>
            </div>
          )}

          {/* Quick Navigation */}
          {players.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Quick Navigation
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {Object.keys(grouped).slice(0, 5).map((tournament) => (
                    <a
                      key={tournament}
                      href={`#${tournament.replace(/\s+/g, '-').toLowerCase()}`}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                      {tournament}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}