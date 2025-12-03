'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch(`${API_URL}/teams`);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error loading teams:', error);
        alert('Error loading teams');
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/teams/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team');
      }
      
      // Remove the team from state instead of reloading
      setTeams(teams.filter(team => team.id !== id));
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading teams...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-gray-600">Create, edit, and manage your teams</p>
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
            <h2 className="text-2xl font-semibold text-gray-800">All Teams</h2>
            <Link 
              href="/admin/teams/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Team</span>
            </Link>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No teams found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first team</p>
              <Link 
                href="/admin/teams/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Create Team
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      League
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tournament
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Players
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                          {team.players && team.players.length > 0 && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {team.players.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {team.league ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900 font-medium">
                              {team.league.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No league</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {team.league?.tournament ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                              {team.league.tournament.name}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {new Date(team.league.tournament.start_date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No tournament</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {team.players ? team.players.length : 0} players
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/teams/edit/${team.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(team.id)}
                            className="text-red-600 hover:text-red-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                          {team.players && team.players.length > 0 && (
                            <Link
                              href={`/admin/teams/${team.id}/players`}
                              className="text-green-600 hover:text-green-900 font-semibold transition duration-150 flex items-center space-x-1"
                            >
                              <span>👥</span>
                              <span>Players</span>
                            </Link>
                          )}
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
        {teams.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
                <div className="text-sm text-blue-800">Total Teams</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {teams.filter(t => t.league).length}
                </div>
                <div className="text-sm text-green-800">With Leagues</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {teams.filter(t => t.league?.tournament).length}
                </div>
                <div className="text-sm text-purple-800">In Tournaments</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {teams.reduce((total, team) => total + (team.players ? team.players.length : 0), 0)}
                </div>
                <div className="text-sm text-orange-800">Total Players</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}