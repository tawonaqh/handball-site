'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function TeamForm({ team }) {
  const [formData, setFormData] = useState({
    name: '',
    league_id: ''
  });
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function loadLeagues() {
      try {
        const response = await fetch(`${API_URL}/leagues`);
        if (!response.ok) {
          throw new Error('Failed to fetch leagues');
        }
        const data = await response.json();
        setLeagues(data);
        
        // Initialize form with team data if editing
        if (team) {
          setFormData({
            name: team.name || '',
            league_id: team.league_id?.toString() || team.league?.id?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error loading leagues:', error);
        setErrors({ leagues: 'Failed to load leagues' });
      } finally {
        setLeaguesLoading(false);
      }
    }
    
    loadLeagues();
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Team name must be at least 2 characters';
    }

    if (!formData.league_id) {
      newErrors.league_id = 'Please select a league';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const method = team ? 'PUT' : 'POST';
      const url = team 
        ? `${API_URL}/teams/${team.id}`
        : `${API_URL}/teams`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          league_id: parseInt(formData.league_id)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${team ? 'update' : 'create'} team`);
      }

      // Success - redirect to teams list
      router.push('/admin/teams');
      router.refresh();

    } catch (error) {
      console.error('Error saving team:', error);
      setErrors({ submit: error.message || `An error occurred while ${team ? 'updating' : 'creating'} the team` });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/teams');
  };

  const selectedLeague = leagues.find(l => l.id === parseInt(formData.league_id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {team ? 'Edit Team' : 'Create New Team'}
              </h1>
              <p className="text-gray-600">
                {team 
                  ? `Update "${team.name}" team details` 
                  : 'Create a new team and assign it to a league'
                }
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <span>🏠</span>
              <span>Dashboard Home</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter team name (e.g., Team Alpha, Warriors FC)"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* League Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                League <span className="text-red-500">*</span>
              </label>
              {leaguesLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading leagues...</span>
                </div>
              ) : errors.leagues ? (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>{errors.leagues}</span>
                  </p>
                </div>
              ) : (
                <select
                  name="league_id"
                  value={formData.league_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.league_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || leagues.length === 0}
                >
                  <option value="" className="text-gray-600">Select a league</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id} className="text-gray-600">
                      {league.name} {league.tournament && `(${league.tournament.name})`}
                    </option>
                  ))}
                </select>
              )}
              {errors.league_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.league_id}</span>
                </p>
              )}
              {!leaguesLoading && leagues.length === 0 && !errors.leagues && (
                <p className="mt-2 text-sm text-amber-600 flex items-center space-x-2">
                  <span>💡</span>
                  <span>No leagues available. Please create a league first.</span>
                </p>
              )}
            </div>

            {/* Selected League Info */}
            {selectedLeague && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Selected League Information</span>
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <div>
                    <strong>League:</strong> {selectedLeague.name}
                  </div>
                  {selectedLeague.tournament && (
                    <div>
                      <strong>Tournament:</strong> {selectedLeague.tournament.name}
                    </div>
                  )}
                  {selectedLeague.tournament && (
                    <div>
                      <strong>Tournament Dates:</strong> {new Date(selectedLeague.tournament.start_date).toLocaleDateString()} - {new Date(selectedLeague.tournament.end_date).toLocaleDateString()}
                    </div>
                  )}
                  {selectedLeague.teams && (
                    <div>
                      <strong>Current Teams:</strong> {selectedLeague.teams.length} teams
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Team Info (for edit mode) */}
            {team && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>Current Team Information</span>
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>Name:</strong> {team.name}</div>
                  <div><strong>League:</strong> {team.league ? team.league.name : 'Not assigned'}</div>
                  <div><strong>Tournament:</strong> {team.league?.tournament ? team.league.tournament.name : 'N/A'}</div>
                  <div><strong>Players:</strong> {team.players ? team.players.length : 0} players</div>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 flex items-center space-x-2">
                  <span>❌</span>
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || leagues.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{team ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{team ? '💾' : '✨'}</span>
                    <span>{team ? 'Update Team' : 'Create Team'}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>↩️</span>
                <span>Cancel</span>
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span>💡</span>
                <span>About Teams</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Teams compete in leagues within tournaments</li>
                <li>• Each team must be assigned to one league</li>
                <li>• Players can be added to teams for roster management</li>
                <li>• Teams can participate in multiple matches within their league</li>
              </ul>
            </div>

            {/* Create League Prompt */}
            {!team && leagues.length === 0 && !leaguesLoading && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                  <span>🚨</span>
                  <span>No Leagues Available</span>
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You need to create a league before you can create a team.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/leagues/create')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
                >
                  Create League First
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}