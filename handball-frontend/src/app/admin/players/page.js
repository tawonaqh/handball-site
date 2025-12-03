'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadPlayers() {
      try {
        const response = await fetch(`${API_URL}/players`);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error loading players:', error);
        alert('Error loading players');
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this player? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/players/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete player');
      }
      
      // Remove the player from state instead of reloading
      setPlayers(players.filter(player => player.id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading players...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Player Management</h1>
            <p className="text-gray-600">Create, edit, and manage your players</p>
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
            <h2 className="text-2xl font-semibold text-gray-800">All Players</h2>
            <Link 
              href="/admin/players/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Player</span>
            </Link>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {players.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No players found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first player</p>
              <Link 
                href="/admin/players/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Create Player
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Team & League
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Statistics
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{player.name}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(player.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          player.position === 'Forward' ? 'bg-red-100 text-red-800' :
                          player.position === 'Midfielder' ? 'bg-yellow-100 text-yellow-800' :
                          player.position === 'Defender' ? 'bg-blue-100 text-blue-800' :
                          player.position === 'Goalkeeper' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {player.position || 'Not set'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {player.team ? (
                            <div className="space-y-1">
                              <div className="font-medium">{player.team.name}</div>
                              {player.team.league && (
                                <div className="text-xs text-gray-500">
                                  {player.team.league.name}
                                  {player.team.league.tournament && (
                                    <span className="ml-1">• {player.team.league.tournament.name}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No team</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 space-y-1">
                          <div className="flex space-x-4 text-xs">
                            <div className="text-center">
                              <div className="font-bold text-gray-900">{player.matches_played || 0}</div>
                              <div className="text-gray-500">Matches</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600">{player.goals || 0}</div>
                              <div className="text-gray-500">Goals</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-blue-600">{player.assists || 0}</div>
                              <div className="text-gray-500">Assists</div>
                            </div>
                          </div>
                          {player.bio && (
                            <div className="text-xs text-gray-500 truncate max-w-xs" title={player.bio}>
                              {player.bio.length > 50 ? `${player.bio.substring(0, 50)}...` : player.bio}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/players/edit/${player.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(player.id)}
                            className="text-red-600 hover:text-red-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {players.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{players.length}</div>
                <div className="text-sm text-blue-800">Total Players</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {players.filter(p => p.team).length}
                </div>
                <div className="text-sm text-green-800">With Teams</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {players.reduce((total, player) => total + (player.goals || 0), 0)}
                </div>
                <div className="text-sm text-purple-800">Total Goals</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {players.reduce((total, player) => total + (player.matches_played || 0), 0)}
                </div>
                <div className="text-sm text-orange-800">Total Matches</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}