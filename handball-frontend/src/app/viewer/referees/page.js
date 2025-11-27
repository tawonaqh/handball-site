// app/viewer/referees/page.js
import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Scale, MapPin, Award, Phone, Mail, Users } from "lucide-react";

export default async function RefereesPage() {
  const referees = await fetcher('referees');

  // Group referees by tournament
  const groupedReferees = referees.reduce((acc, referee) => {
    const tournamentName = referee.tournament?.name || "Unassigned";
    if (!acc[tournamentName]) acc[tournamentName] = [];
    acc[tournamentName].push(referee);
    return acc;
  }, {});

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'international': return 'from-purple-500 to-pink-500';
      case 'national': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getLevelText = (level) => {
    switch (level?.toLowerCase()) {
      case 'international': return 'International';
      case 'national': return 'National';
      default: return 'Regional';
    }
  };

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
                <Scale className="text-white" size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">Match Officials</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our professional referees ensuring fair play across all tournaments
            </p>
          </div>

          {/* Referees by Tournament */}
          <div className="space-y-12">
            {Object.entries(groupedReferees).map(([tournament, tournamentReferees]) => (
              <section key={tournament} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{tournament}</h2>
                      <p className="text-blue-100 font-medium">
                        {tournamentReferees.length} {tournamentReferees.length === 1 ? 'Official' : 'Officials'}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <Scale className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                {/* Referees Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournamentReferees.map((referee) => (
                      <div
                        key={referee.id}
                        className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        {/* Referee Header */}
                        <div className="text-center mb-4">
                          <div className={`w-20 h-20 bg-gradient-to-br ${getLevelColor(referee.level)} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <Users className="text-white" size={32} />
                          </div>
                          <h3 className="font-bold text-gray-900 text-xl mb-2">{referee.name}</h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getLevelColor(referee.level)}`}>
                            {getLevelText(referee.level)}
                          </span>
                        </div>

                        {/* Referee Details */}
                        <div className="space-y-3 mb-4">
                          {referee.license_number && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Award size={16} className="text-yellow-500" />
                              <span>License: {referee.license_number}</span>
                            </div>
                          )}
                          {referee.email && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail size={16} className="text-blue-500" />
                              <span className="truncate">{referee.email}</span>
                            </div>
                          )}
                          {referee.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone size={16} className="text-green-500" />
                              <span>{referee.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-red-500" />
                            <span>{referee.tournament?.name}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className={`text-sm font-medium ${referee.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {referee.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {referee.games_count || 0} matches
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {referees.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Referees Available</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no referees registered in the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}