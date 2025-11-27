import { fetcher } from "@/lib/api";
import GameCard from "@/components/GameCard";
import Link from "next/link";
import ViewerLayout from "@/components/ViewerLayout";

export default async function LeaguePage({ params }) {
  const league = await fetcher(`leagues/${params.id}`);
  const games = await fetcher("games");
  const leagueGames = games.filter((g) => g.league_id === league.id);

  // Separate upcoming and completed games
  const upcomingGames = leagueGames.filter(game => !game.completed);
  const completedGames = leagueGames.filter(game => game.completed);

  console.log("League Games:", leagueGames);

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* League Header */}
          <header className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 shadow-2xl mb-6">
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-md">
                {league.name}
              </h1>
              <div className="w-20 h-1 bg-white/80 rounded-full mx-auto mb-4"></div>
              <p className="text-orange-100 text-xl font-semibold">
                {league.tournament?.name || "Independent League"}
              </p>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {league.teams?.length || 0}
              </div>
              <div className="text-gray-600 font-medium">Teams</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {leagueGames.length}
              </div>
              <div className="text-gray-600 font-medium">Total Matches</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {completedGames.length}
              </div>
              <div className="text-gray-600 font-medium">Matches Played</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Teams Section */}
            <section className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Participating Teams
                  </h2>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                    {league.teams?.length || 0}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {league.teams?.map((team, index) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 border border-orange-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-600">
                            Points: <span className="font-semibold text-orange-600">{team.ranking?.points || 0}</span>
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/viewer/teams/${team.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Matches Section */}
            <section className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Matches
                  </h2>
                  <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                      Upcoming: {upcomingGames.length}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                      Completed: {completedGames.length}
                    </span>
                  </div>
                </div>

                {/* Upcoming Games */}
                {upcomingGames.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Upcoming Matches
                    </h3>
                    <div className="space-y-4">
                      {upcomingGames.map((game) => (
                        <div
                          key={game.id}
                          className="border-2 border-green-200 rounded-xl hover:border-green-300 transition-all duration-300"
                        >
                          <GameCard game={game} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Games */}
                {completedGames.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Match Results
                    </h3>
                    <div className="space-y-4">
                      {completedGames.map((game) => (
                        <div
                          key={game.id}
                          className="border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all duration-300"
                        >
                          <GameCard game={game} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Games State */}
                {leagueGames.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏐</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Matches Scheduled</h3>
                    <p className="text-gray-500">Check back later for upcoming matches!</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}