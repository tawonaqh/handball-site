import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function PlayerPage({ params }) {
  const player = await fetcher(`players/${params.id}`);

  // Calculate additional stats
  const goalsPerMatch = player.matches_played ? (player.goals / player.matches_played).toFixed(2) : 0;
  const assistsPerMatch = player.matches_played ? (player.assists / player.matches_played).toFixed(2) : 0;

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Player Header */}
          <section className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="md:flex">
              {/* Player Photo & Basic Info */}
              <div className="md:w-2/5 bg-gradient-to-br from-orange-500 to-yellow-500 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 bg-white rounded-full shadow-2xl mb-6 flex items-center justify-center border-4 border-white overflow-hidden">
                  {player.photo ? (
                    <Image
                      src={player.photo}
                      alt={player.name}
                      width={160}
                      height={160}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="text-white">
                  {player.jersey_number && (
                    <div className="text-4xl font-black mb-2 drop-shadow-lg">
                      #{player.jersey_number}
                    </div>
                  )}
                  {player.position && (
                    <div className="text-xl font-semibold bg-white/20 px-4 py-1 rounded-full mb-2">
                      {player.position}
                    </div>
                  )}
                  {player.age && (
                    <div className="text-lg opacity-90">
                      Age: {player.age}
                    </div>
                  )}
                  {player.nationality && (
                    <div className="text-lg opacity-90">
                      {player.nationality}
                    </div>
                  )}
                </div>
              </div>

              {/* Player Details */}
              <div className="md:w-3/5 p-8">
                <h1 className="text-4xl font-black text-gray-900 mb-4">
                  {player.name}
                </h1>
                
                {/* Team Information */}
                <div className="space-y-3 mb-6">
                  {player.team && (
                    <Link 
                      href={`/viewer/teams/${player.team.id}`}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {player.team.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {player.team.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current Team
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* League & Tournament */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {player.team?.league && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">
                          <span className="font-semibold">League:</span> {player.team.league.name}
                        </span>
                      </div>
                    )}
                    {player.team?.league?.tournament && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          <span className="font-semibold">Tournament:</span> {player.team.league.tournament.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center bg-orange-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {player.matches_played || 0}
                    </div>
                    <div className="text-xs text-orange-800 font-medium">Matches</div>
                  </div>
                  <div className="text-center bg-yellow-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {player.goals || 0}
                    </div>
                    <div className="text-xs text-yellow-800 font-medium">Goals</div>
                  </div>
                  <div className="text-center bg-amber-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      {player.assists || 0}
                    </div>
                    <div className="text-xs text-amber-800 font-medium">Assists</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Biography */}
              {player.bio && (
                <section className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    Player Biography
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {player.bio}
                  </p>
                </section>
              )}

              {/* Detailed Statistics */}
              <section className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Performance Statistics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Matches Played</span>
                        <span className="font-bold text-gray-900">{player.matches_played || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Goals Scored</span>
                        <span className="font-bold text-orange-600">{player.goals || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Assists</span>
                        <span className="font-bold text-yellow-600">{player.assists || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Goals per Match</span>
                        <span className="font-bold text-green-600">{goalsPerMatch}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Assists per Match</span>
                        <span className="font-bold text-blue-600">{assistsPerMatch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Info</h3>
                    <div className="space-y-3">
                      {player.height && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Height</span>
                          <span className="font-bold text-gray-900">{player.height} cm</span>
                        </div>
                      )}
                      {player.weight && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Weight</span>
                          <span className="font-bold text-gray-900">{player.weight} kg</span>
                        </div>
                      )}
                      {player.preferred_foot && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Preferred Foot</span>
                          <span className="font-bold text-gray-900">{player.preferred_foot}</span>
                        </div>
                      )}
                      {player.join_date && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Join Date</span>
                          <span className="font-bold text-gray-900">
                            {new Date(player.join_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Achievements */}
              {(player.awards || player.achievements) && (
                <section className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Achievements & Awards
                  </h2>
                  <div className="space-y-2">
                    {player.awards?.map((award, index) => (
                      <div key={index} className="flex items-center space-x-2 py-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-gray-700">{award}</span>
                      </div>
                    ))}
                    {player.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 py-2">
                        <span className="text-blue-500">⭐</span>
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact/Additional Info */}
              <section className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Player Info</h2>
                <div className="space-y-3 text-sm">
                  {player.email && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📧</span>
                      <span className="text-gray-700">{player.email}</span>
                    </div>
                  )}
                  {player.phone && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📞</span>
                      <span className="text-gray-700">{player.phone}</span>
                    </div>
                  )}
                  {player.birth_date && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🎂</span>
                      <span className="text-gray-700">
                        {new Date(player.birth_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}