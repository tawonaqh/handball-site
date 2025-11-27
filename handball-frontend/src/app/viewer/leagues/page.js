import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from 'next/link';
import Image from 'next/image';

export default async function LeaguesPage() {
  const leagues = await fetcher('leagues');

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Handball Leagues
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all the exciting handball leagues and their participating teams
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Leagues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 overflow-hidden"
              >
                {/* League Header */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
                  <h2 className="text-2xl font-bold text-white text-center line-clamp-2">
                    {league.name}
                  </h2>
                  <p className="text-orange-100 text-center mt-2 font-medium">
                    {league.tournament?.name || "Independent League"}
                  </p>
                </div>

                {/* League Content */}
                <div className="p-6">
                  {/* Teams Section */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Participating Teams
                    </h3>
                    
                    {league.teams && league.teams.length > 0 ? (
                      <div className="space-y-3">
                        {league.teams.slice(0, 4).map((team) => (
                          <Link
                            key={team.id}
                            href={`/viewer/teams/${team.id}`}
                            className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 group"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-800 group-hover:text-orange-700 transition-colors">
                                {team.name}
                              </span>
                            </div>
                            <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </div>
                          </Link>
                        ))}
                        
                        {league.teams.length > 4 && (
                          <div className="text-center pt-2">
                            <span className="text-sm text-orange-600 font-medium">
                              +{league.teams.length - 4} more teams
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-gray-400 mb-2">⚽</div>
                        <p className="text-gray-500 italic">No teams registered yet</p>
                      </div>
                    )}
                  </div>

                  {/* League Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href={`/viewer/leagues/${league.id}`}
                      className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      View League Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {leagues.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Leagues Available</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no active leagues. Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}