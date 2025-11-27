import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Trophy, Calendar, Users, MapPin, ArrowRight } from "lucide-react";

export default async function TournamentsPage() {
  const tournaments = await fetcher("tournaments");

  // Calculate statistics
  const totalTournaments = tournaments.length;
  const activeTournaments = tournaments.filter(t => {
    const today = new Date();
    const startDate = new Date(t.start_date);
    const endDate = new Date(t.end_date);
    return startDate <= today && endDate >= today;
  }).length;
  const upcomingTournaments = tournaments.filter(t => new Date(t.start_date) > new Date()).length;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get tournament status
  const getTournamentStatus = (tournament) => {
    const today = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);
    
    if (today < startDate) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (today > endDate) return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
    return { status: 'active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 shadow-2xl">
                <Trophy className="text-white" size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Handball Tournaments
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover exciting handball competitions and follow your favorite teams through thrilling tournaments
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {totalTournaments}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Tournaments</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {activeTournaments}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active Now</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {upcomingTournaments}
                </div>
                <div className="text-sm text-gray-600 font-medium">Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Tournaments Grid */}
          {tournaments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Tournaments Available</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Check back later for upcoming handball tournaments and competitions.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mt-6 rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map((tournament) => {
                const status = getTournamentStatus(tournament);
                
                return (
                  <div
                    key={tournament.id}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {/* Tournament Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-full p-3">
                          <Trophy className="text-white" size={24} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white line-clamp-2">
                        {tournament.name}
                      </h2>
                    </div>

                    {/* Tournament Details */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {/* Date */}
                        <div className="flex items-center space-x-3">
                          <Calendar className="text-orange-500 flex-shrink-0" size={20} />
                          <div className="text-sm text-gray-700">
                            <div className="font-semibold">Tournament Dates</div>
                            <div>{formatDate(tournament.start_date)} – {formatDate(tournament.end_date)}</div>
                          </div>
                        </div>

                        {/* Location */}
                        {tournament.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="text-red-500 flex-shrink-0" size={20} />
                            <div className="text-sm text-gray-700">
                              <div className="font-semibold">Location</div>
                              <div>{tournament.location}</div>
                            </div>
                          </div>
                        )}

                        {/* Leagues Count */}
                        <div className="flex items-center space-x-3">
                          <Users className="text-blue-500 flex-shrink-0" size={20} />
                          <div className="text-sm text-gray-700">
                            <div className="font-semibold">Competition</div>
                            <div>{tournament.leagues_count || 0} Leagues</div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {tournament.description && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {tournament.description}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link
                        href={`/viewer/tournaments/${tournament.id}`}
                        className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <span>View Tournament</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          {tournaments.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white rounded-3xl p-8 shadow-lg inline-block">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Want to participate in tournaments?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Contact tournament organizers or check team registration details for upcoming competitions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg">
                    Contact Organizers
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
                    View Registration Info
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}