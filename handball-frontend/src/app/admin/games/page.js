'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetcher } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesData, teamsData, leaguesData, refereesData] = await Promise.all([
          fetcher('games?include=referee'),
          fetcher('teams'),
          fetcher('leagues'),
          fetcher('referees')
        ]);
        setGames(gamesData);
        setTeams(teamsData);
        setLeagues(leaguesData);
        setReferees(refereesData);
      } catch (error) {
        console.error('Error loading games:', error);
        alert('Error loading games');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/games/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      
      setGames(games.filter(game => game.id !== id));
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Error deleting game');
    }
  }

  // Create lookups for teams, leagues, and referees
  const teamLookup = Object.fromEntries(teams.map(t => [t.id, t]));
  const leagueLookup = Object.fromEntries(leagues.map(l => [l.id, l]));
  const refereeLookup = Object.fromEntries(referees.map(r => [r.id, r]));

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

  // Calculate statistics
  const totalMatches = games.length;
  const completedMatches = games.filter(g => g.status === 'completed').length;
  const upcomingMatches = games.filter(g => g.status === 'scheduled' || !g.status).length;
  const liveMatches = games.filter(g => g.status === 'live').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Game Management</h1>
            <p className="text-gray-600">Create, edit, and manage your games</p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
          >
            🏠 Dashboard Home
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">All Games</h2>
            <Link 
              href="/admin/games/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Game</span>
            </Link>
          </div>
        </div>

        {/* Games Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {games.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏐</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No games found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first game</p>
              <Link 
                href="/admin/games/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Create Game
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      League & Tournament
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status & Referee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {games.map((game) => {
                    const homeTeam = teamLookup[game.home_team_id];
                    const awayTeam = teamLookup[game.away_team_id];
                    const league = leagueLookup[game.league_id];
                    const matchDate = new Date(game.match_date);
                    const refereeName = getRefereeName(game);
                    const isCompleted = game.status === 'completed';
                    const isLive = game.status === 'live';
                    const isUpcoming = !isCompleted && !isLive;

                    return (
                      <tr key={game.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-semibold text-gray-900">
                                  {homeTeam?.name || 'TBD'}
                                </div>
                                {(isCompleted || isLive) && (
                                  <div className="text-lg font-bold text-gray-900">
                                    {game.home_score ?? 0} - {game.away_score ?? 0}
                                  </div>
                                )}
                                {isUpcoming && (
                                  <div className="text-sm text-gray-500 font-medium">VS</div>
                                )}
                                <div className="text-sm font-semibold text-gray-900">
                                  {awayTeam?.name || 'TBD'}
                                </div>
                              </div>
                              {game.venue && (
                                <div className="text-xs text-gray-500 mt-1">
                                  📍 {game.venue}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {matchDate.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {league ? (
                              <div className="space-y-1">
                                <div className="font-medium">{league.name}</div>
                                {league.tournament && (
                                  <div className="text-xs text-gray-500">
                                    {league.tournament.name}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No league</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isLive 
                                ? 'bg-red-100 text-red-800' 
                                : isCompleted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
                            </span>
                            {refereeName && (
                              <div className="text-xs text-gray-600 mt-1">
                                👤 {refereeName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <Link
                              href={`/admin/games/edit/${game.id}`}
                              className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDelete(game.id)}
                              className="text-red-600 hover:text-red-900 font-semibold transition duration-150 flex items-center space-x-1"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {games.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{totalMatches}</div>
                <div className="text-sm text-blue-800">Total Matches</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{completedMatches}</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{upcomingMatches}</div>
                <div className="text-sm text-purple-800">Upcoming</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{liveMatches}</div>
                <div className="text-sm text-red-800">Live Now</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
