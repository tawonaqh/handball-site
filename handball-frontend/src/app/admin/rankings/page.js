'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadRankings() {
      try {
        const response = await fetch(`${API_URL}/rankings`);
        if (!response.ok) {
          throw new Error('Failed to fetch rankings');
        }
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Error loading rankings:', error);
        alert('Error loading rankings');
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this ranking? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/rankings/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete ranking');
      }
      
      // Remove the ranking from state instead of reloading
      setRankings(rankings.filter(ranking => ranking.id !== id));
    } catch (error) {
      console.error('Error deleting ranking:', error);
      alert('Error deleting ranking');
    }
  }

  // Sort rankings by points (descending), then goal difference (descending), then goals for (descending)
  const sortedRankings = [...rankings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = (a.goals_for || 0) - (a.goals_against || 0);
    const goalDiffB = (b.goals_for || 0) - (b.goals_against || 0);
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return (b.goals_for || 0) - (a.goals_for || 0);
  });

  const calculateGoalDifference = (ranking) => {
    return (ranking.goals_for || 0) - (ranking.goals_against || 0);
  };

  const getFormColor = (ranking) => {
    const wins = ranking.wins || 0;
    const draws = ranking.draws || 0;
    const losses = ranking.losses || 0;
    const total = wins + draws + losses;
    
    if (total === 0) return 'text-gray-500';
    
    const winPercentage = wins / total;
    if (winPercentage >= 0.6) return 'text-green-600';
    if (winPercentage >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading rankings...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Rankings Management</h1>
            <p className="text-gray-600">View and manage team standings across leagues</p>
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
            <h2 className="text-2xl font-semibold text-gray-800">League Standings</h2>
            <Link 
              href="/admin/rankings/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Ranking</span>
            </Link>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {rankings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No rankings found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first ranking entry</p>
              <Link 
                href="/admin/rankings/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Add Ranking
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      League
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Matches
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Record
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Goals
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRankings.map((ranking, index) => (
                    <tr key={ranking.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {ranking.team?.name?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{ranking.team?.name || 'Unknown Team'}</div>
                            <div className="text-xs text-gray-500">
                              {ranking.team?.league?.name || 'No League'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ranking.league?.name || 'No League'}
                        </div>
                        {ranking.league?.tournament && (
                          <div className="text-xs text-gray-500">
                            {ranking.league.tournament.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {ranking.played || 0}
                        </div>
                        <div className="text-xs text-gray-500">played</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="flex space-x-2 text-xs">
                            <span className="text-green-600 font-semibold">{ranking.wins || 0}W</span>
                            <span className="text-yellow-600 font-semibold">{ranking.draws || 0}D</span>
                            <span className="text-red-600 font-semibold">{ranking.losses || 0}L</span>
                          </div>
                          <div className={`text-xs font-semibold ${getFormColor(ranking)}`}>
                            {((ranking.wins || 0) / (ranking.played || 1) * 100).toFixed(1)}% Win Rate
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-gray-900">
                            {ranking.goals_for || 0} : {ranking.goals_against || 0}
                          </div>
                          <div className={`text-xs font-semibold ${
                            calculateGoalDifference(ranking) > 0 ? 'text-green-600' :
                            calculateGoalDifference(ranking) < 0 ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {calculateGoalDifference(ranking) > 0 ? '+' : ''}{calculateGoalDifference(ranking)} GD
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {ranking.points || 0}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/rankings/edit/${ranking.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(ranking.id)}
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
        {rankings.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{rankings.length}</div>
                <div className="text-sm text-blue-800">Total Rankings</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(rankings.map(r => r.league_id)).size}
                </div>
                <div className="text-sm text-green-800">Leagues</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {rankings.reduce((total, ranking) => total + (ranking.points || 0), 0)}
                </div>
                <div className="text-sm text-purple-800">Total Points</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {rankings.reduce((total, ranking) => total + (ranking.goals_for || 0), 0)}
                </div>
                <div className="text-sm text-orange-800">Total Goals</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}