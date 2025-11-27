import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Users, ArrowLeft, Star, Award } from "lucide-react";

export default async function TournamentDetailPage({ params }) {
  const tournament = await fetcher(`tournaments/${params.id}`);

  // Calculate statistics
  const totalLeagues = tournament.leagues?.length || 0;
  const totalTeams = tournament.leagues?.reduce((total, league) => 
    total + (league.teams?.length || 0), 0) || 0;
  const totalGames = tournament.leagues?.reduce((total, league) => 
    total + (league.games?.length || 0), 0) || 0;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get tournament status
  const getTournamentStatus = () => {
    const today = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);
    
    if (today < startDate) return { 
      status: 'Upcoming', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '⏳'
    };
    if (today > endDate) return { 
      status: 'Completed', 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '✅'
    };
    return { 
      status: 'Live Now', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🔥'
    };
  };

  const status = getTournamentStatus();

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/viewer/tournaments"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to Tournaments</span>
            </Link>
          </div>

          {/* Tournament Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-4">
                    <Trophy className="text-white" size={32} />
                  </div>
                  <div>
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold border ${status.color}`}>
                      <span>{status.icon}</span>
                      <span>{status.status}</span>
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                  {tournament.name}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-orange-500" size={20} />
                    <span className="font-semibold">
                      {formatDate(tournament.start_date)} – {formatDate(tournament.end_date)}
                    </span>
                  </div>
                  
                  {tournament.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-red-500" size={20} />
                      <span className="font-semibold">{tournament.location}</span>
                    </div>
                  )}
                </div>

                {tournament.description && (
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {tournament.description}
                  </p>
                )}
              </div>

              {/* Tournament Stats */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 min-w-64">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2 text-orange-500" size={20} />
                  Tournament Stats
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{totalLeagues}</div>
                    <div className="text-sm text-gray-600">Leagues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{totalTeams}</div>
                    <div className="text-sm text-gray-600">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">{totalGames}</div>
                    <div className="text-sm text-gray-600">Matches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leagues Section */}
          <section className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <Trophy className="mr-3 text-orange-500" size={28} />
                  Tournament Leagues
                </h2>
                <p className="text-gray-600">
                  Competitive divisions within the {tournament.name} tournament
                </p>
              </div>
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                {totalLeagues} {totalLeagues === 1 ? 'League' : 'Leagues'}
              </span>
            </div>

            {tournament.leagues?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournament.leagues.map((league) => (
                  <div
                    key={league.id}
                    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* League Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center">
                        <Star className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                          {league.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {league.teams?.length || 0} teams
                        </p>
                      </div>
                    </div>

                    {/* League Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {league.games?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Matches</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-600">
                          {league.games?.filter(g => g.status === 'completed').length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                    </div>

                    {/* League Description */}
                    {league.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {league.description}
                      </p>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/viewer/leagues/${league.id}`}
                      className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>View League</span>
                      <Users size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">No Leagues Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  This tournament doesn't have any leagues yet. Check back later for updates.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
              </div>
            )}
          </section>

          {/* Additional Information */}
          {(tournament.rules || tournament.prize_pool) && (
            <section className="mt-8 bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="mr-3 text-orange-500" size={24} />
                Tournament Details
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {tournament.rules && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Rules & Format</h4>
                    <p className="text-gray-700 leading-relaxed">{tournament.rules}</p>
                  </div>
                )}
                {tournament.prize_pool && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Prize Pool</h4>
                    <p className="text-gray-700 leading-relaxed">{tournament.prize_pool}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Quick Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link 
              href="/viewer/tournaments"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to All Tournaments</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Last updated: {new Date(tournament.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}