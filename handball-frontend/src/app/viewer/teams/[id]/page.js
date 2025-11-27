import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function TeamPage({ params }) {
  const team = await fetcher(`teams/${params.id}`);

  // Calculate team statistics
  const playerCount = team.players?.length || 0;
  const averageAge = team.players?.length 
    ? Math.round(team.players.reduce((sum, player) => sum + (player.age || 0), 0) / playerCount)
    : 0;

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Team Header */}
          <section className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl shadow-2xl overflow-hidden mb-12">
            <div className="relative p-8 md:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-black"></div>
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                    {team.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">
                        {team.league?.name || "Independent Team"}
                      </span>
                    </div>
                    {team.ranking?.points !== undefined && (
                      <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">
                          {team.ranking.points} Points
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Team Logo/Badge */}
                <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white">
                  {team.logo ? (
                    <Image
                      src={team.logo}
                      alt={`${team.name} logo`}
                      width={96}
                      height={96}
                      className="rounded-xl"
                    />
                  ) : (
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      {team.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Team Stats */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {playerCount}
              </div>
              <div className="text-gray-600 font-medium">Total Players</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {averageAge}
              </div>
              <div className="text-gray-600 font-medium">Average Age</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {team.ranking?.position || '-'}
              </div>
              <div className="text-gray-600 font-medium">League Position</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {team.ranking?.points || 0}
              </div>
              <div className="text-gray-600 font-medium">Total Points</div>
            </div>
          </section>

          {/* Players Section */}
          <section className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Team Players
                </h2>
                <p className="text-gray-600">
                  Meet the talented players representing {team.name}
                </p>
              </div>
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                {playerCount} {playerCount === 1 ? 'Player' : 'Players'}
              </div>
            </div>

            {team.players?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-orange-200 text-center"
                  >
                    {/* Player Avatar */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md">
                        {player.photo ? (
                          <Image
                            src={player.photo}
                            alt={player.name}
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-white text-xl font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {player.position && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          {player.position}
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="space-y-2 mb-4">
                      <Link
                        href={`/viewer/players/${player.id}`}
                        className="block font-bold text-gray-900 text-lg hover:text-orange-700 transition-colors line-clamp-2 group-hover:underline"
                      >
                        {player.name}
                      </Link>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {player.jersey_number && (
                          <div className="flex justify-between">
                            <span>Jersey:</span>
                            <span className="font-semibold text-gray-800">
                              #{player.jersey_number}
                            </span>
                          </div>
                        )}
                        {player.age && (
                          <div className="flex justify-between">
                            <span>Age:</span>
                            <span className="font-semibold text-gray-800">
                              {player.age}
                            </span>
                          </div>
                        )}
                        {player.nationality && (
                          <div className="flex justify-between">
                            <span>Nationality:</span>
                            <span className="font-semibold text-gray-800">
                              {player.nationality}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href={`/viewer/players/${player.id}`}
                      className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-2 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Players Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This team doesn't have any registered players yet. Check back later for updates!
                </p>
              </div>
            )}
          </section>

          {/* Additional Team Info Section */}
          {(team.coach || team.founded_year || team.home_venue) && (
            <section className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.coach && (
                  <div className="text-center">
                    <div className="text-gray-600 font-medium mb-2">Head Coach</div>
                    <div className="text-lg font-semibold text-gray-900">{team.coach}</div>
                  </div>
                )}
                {team.founded_year && (
                  <div className="text-center">
                    <div className="text-gray-600 font-medium mb-2">Founded</div>
                    <div className="text-lg font-semibold text-gray-900">{team.founded_year}</div>
                  </div>
                )}
                {team.home_venue && (
                  <div className="text-center">
                    <div className="text-gray-600 font-medium mb-2">Home Venue</div>
                    <div className="text-lg font-semibold text-gray-900">{team.home_venue}</div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}