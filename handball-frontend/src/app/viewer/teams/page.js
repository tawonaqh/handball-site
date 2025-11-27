import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function TeamsPage() {
  const teams = await fetcher("teams");

  // Group teams by tournament
  const tournaments = teams.reduce((acc, team) => {
    const tournamentName = team.league?.tournament?.name || "Independent Teams";
    if (!acc[tournamentName]) acc[tournamentName] = [];
    acc[tournamentName].push(team);
    return acc;
  }, {});

  // Sort tournaments by team count (descending)
  const sortedTournaments = Object.entries(tournaments).sort(
    ([, aTeams], [, bTeams]) => bTeams.length - aTeams.length
  );

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Handball Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Explore all teams competing across various tournaments and leagues
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>{Object.keys(tournaments).length} Tournaments</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>{teams.length} Teams</span>
              </div>
            </div>
          </div>

          {/* Tournaments Grid */}
          <div className="space-y-12">
            {sortedTournaments.map(([tournamentName, tournamentTeams]) => (
              <section key={tournamentName} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {tournamentName}
                      </h2>
                      <p className="text-orange-100 font-medium">
                        {tournamentTeams.length} {tournamentTeams.length === 1 ? 'Team' : 'Teams'}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                  </div>
                </div>

                {/* Teams Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tournamentTeams.map((team) => (
                      <div
                        key={team.id}
                        className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-orange-200"
                      >
                        {/* Team Logo and Name */}
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            {team.logo ? (
                              <Image
                                src={team.logo}
                                alt={`${team.name} logo`}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="text-white text-2xl font-bold">
                                {team.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-orange-700 transition-colors">
                            {team.name}
                          </h3>
                        </div>

                        {/* Team Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">League:</span>
                            <span className="font-semibold text-gray-800">
                              {team.league?.name || "Independent"}
                            </span>
                          </div>
                          {team.ranking?.points !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Points:</span>
                              <span className="font-bold text-orange-600">
                                {team.ranking.points}
                              </span>
                            </div>
                          )}
                          {team.players_count !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Players:</span>
                              <span className="font-semibold text-gray-800">
                                {team.players_count}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <Link
                          href={`/viewer/teams/${team.id}`}
                          className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          View Team Details
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {teams.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">🏐</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Teams Available</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                There are currently no teams registered in the system. Check back later for updates!
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
            </div>
          )}

          {/* Quick Stats */}
          {teams.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {teams.length}
                </div>
                <div className="text-gray-600 font-medium">Total Teams</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Object.keys(tournaments).length}
                </div>
                <div className="text-gray-600 font-medium">Active Tournaments</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {Math.max(...Object.values(tournaments).map(teams => teams.length))}
                </div>
                <div className="text-gray-600 font-medium">Largest Tournament</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}