import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function FixturesPage() {
  const games = await fetcher("games?include=referee");
  const teams = await fetcher("teams");
  const leagues = await fetcher("leagues");
  const referees = await fetcher("referees");

  // Quick lookup for teams, leagues, and referees by ID
  const teamLookup = Object.fromEntries(teams.map(t => [t.id, t]));
  const leagueLookup = Object.fromEntries(leagues.map(l => [l.id, l]));
  const refereeLookup = Object.fromEntries(referees.map(r => [r.id, r]));

  // Group games by tournament → league
  const grouped = {};
  games.forEach((g) => {
    const leagueObj = leagueLookup[g.league_id];
    const tournament = leagueObj?.tournament?.name || "Independent Matches";
    const league = leagueObj?.name || "Unassigned League";

    if (!grouped[tournament]) grouped[tournament] = {};
    if (!grouped[tournament][league]) grouped[tournament][league] = [];

    grouped[tournament][league].push(g);
  });

  // Sort games by date (most recent first for completed, upcoming first for scheduled)
  Object.keys(grouped).forEach(tournament => {
    Object.keys(grouped[tournament]).forEach(league => {
      grouped[tournament][league].sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
    });
  });

  // Calculate statistics
  const totalMatches = games.length;
  const completedMatches = games.filter(g => g.status === 'completed').length;
  const upcomingMatches = games.filter(g => g.status === 'scheduled' || !g.status).length;
  const liveMatches = games.filter(g => g.status === 'live').length;

  // Get referee name safely
  const getRefereeName = (match) => {
    if (match.referee_id && refereeLookup[match.referee_id]) {
      return refereeLookup[match.referee_id].name;
    }
    if (match.referee && typeof match.referee === 'object') {
      return match.referee.name;
    }
    if (typeof match.referee === 'string') {
      return match.referee;
    }
    return null;
  };

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Fixtures & Results
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Follow all the handball matches, from upcoming fixtures to completed results
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {totalMatches}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Matches</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {completedMatches}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completed</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {upcomingMatches}
                </div>
                <div className="text-sm text-gray-600 font-medium">Upcoming</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {liveMatches}
                </div>
                <div className="text-sm text-gray-600 font-medium">Live Now</div>
              </div>
            </div>
          </div>

          {/* Matches Organization */}
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
                        {Object.values(leagues).reduce((total, matches) => total + matches.length, 0)} Matches
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                  </div>
                </div>

                {/* Leagues and Matches */}
                <div className="p-8 space-y-8">
                  {Object.entries(leagues).map(([league, matches]) => (
                    <div key={league} className="space-y-6">
                      {/* League Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">
                          {league}
                        </h3>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {matches.length} matches
                        </span>
                      </div>

                      {/* Matches Grid */}
                      <div className="grid gap-4">
                        {matches.map((match) => {
                          const homeTeam = teamLookup[match.home_team_id];
                          const awayTeam = teamLookup[match.away_team_id];
                          const matchDate = new Date(match.match_date);
                          const isCompleted = match.status === 'completed';
                          const isLive = match.status === 'live';
                          const isUpcoming = !isCompleted && !isLive;
                          const refereeName = getRefereeName(match);

                          return (
                            <div
                              key={match.id}
                              className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                                isLive 
                                  ? 'border-red-300 bg-red-50' 
                                  : isCompleted 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-blue-300 bg-blue-50'
                              }`}
                            >
                              {/* Match Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    isLive 
                                      ? 'bg-red-500 text-white animate-pulse' 
                                      : isCompleted 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-blue-500 text-white'
                                  }`}>
                                    {isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {matchDate.toLocaleDateString()} • {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {match.venue && (
                                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                    {match.venue}
                                  </span>
                                )}
                              </div>

                              {/* Teams and Score */}
                              <div className="grid grid-cols-3 items-center gap-4">
                                {/* Home Team */}
                                <div className="text-right">
                                  <Link
                                    href={`/viewer/teams/${homeTeam?.id}`}
                                    className="group flex items-center justify-end space-x-3"
                                  >
                                    <div className="text-right">
                                      <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                                        {homeTeam?.name || 'TBD'}
                                      </div>
                                      {homeTeam?.ranking?.points !== undefined && (
                                        <div className="text-xs text-gray-600">
                                          {homeTeam.ranking.points} pts
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                      {homeTeam?.logo ? (
                                        <Image
                                          src={homeTeam.logo}
                                          alt={homeTeam.name}
                                          width={32}
                                          height={32}
                                          className="rounded-full"
                                        />
                                      ) : (
                                        homeTeam?.name?.charAt(0).toUpperCase() || 'H'
                                      )}
                                    </div>
                                  </Link>
                                </div>

                                {/* Score */}
                                <div className="text-center">
                                  {isCompleted || isLive ? (
                                    <div className="space-y-1">
                                      <div className="text-2xl font-black text-gray-900">
                                        {match.home_score ?? 0} - {match.away_score ?? 0}
                                      </div>
                                      {isCompleted && (
                                        <div className="text-xs text-gray-600 font-medium">
                                          {match.home_score > match.away_score ? 'Home Win' :
                                           match.home_score < match.away_score ? 'Away Win' : 'Draw'}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-lg font-bold text-gray-500">
                                      VS
                                    </div>
                                  )}
                                </div>

                                {/* Away Team */}
                                <div className="text-left">
                                  <Link
                                    href={`/viewer/teams/${awayTeam?.id}`}
                                    className="group flex items-center space-x-3"
                                  >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                      {awayTeam?.logo ? (
                                        <Image
                                          src={awayTeam.logo}
                                          alt={awayTeam.name}
                                          width={32}
                                          height={32}
                                          className="rounded-full"
                                        />
                                      ) : (
                                        awayTeam?.name?.charAt(0).toUpperCase() || 'A'
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                                        {awayTeam?.name || 'TBD'}
                                      </div>
                                      {awayTeam?.ranking?.points !== undefined && (
                                        <div className="text-xs text-gray-600">
                                          {awayTeam.ranking.points} pts
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                </div>
                              </div>

                              {/* Match Details */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
                                  <div className="flex flex-wrap justify-center gap-4">
                                    {match.round && (
                                      <span className="flex items-center space-x-1">
                                        <span className="text-gray-400">🔄</span>
                                        <span>Round: {match.round}</span>
                                      </span>
                                    )}
                                    {refereeName && (
                                      <span className="flex items-center space-x-1">
                                        <span className="text-gray-400">👤</span>
                                        <span>Referee: {refereeName}</span>
                                      </span>
                                    )}
                                  </div>
                                  {match.venue && (
                                    <span className="flex items-center space-x-1 text-gray-500">
                                      <span className="text-gray-400">🏟️</span>
                                      <span>{match.venue}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {games.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">🏐</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Matches Scheduled</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no matches scheduled. Check back later for upcoming fixtures!
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mt-6 rounded-full"></div>
            </div>
          )}

          {/* Quick Navigation */}
          {games.length > 0 && (
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