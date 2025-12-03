'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [team, setTeam] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    league_id: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Load leagues first
        const leaguesResponse = await fetch(`${API_URL}/leagues`);
        if (!leaguesResponse.ok) {
          throw new Error('Failed to fetch leagues');
        }
        const leaguesData = await leaguesResponse.json();
        setLeagues(leaguesData);

        // Then load team data
        const teamResponse = await fetch(`${API_URL}/teams/${id}`);
        if (!teamResponse.ok) {
          throw new Error('Failed to fetch team');
        }
        const teamData = await teamResponse.json();
        setTeam(teamData);
        
        // Populate form fields with team data
        setFormData({
          name: teamData.name || '',
          league_id: teamData.league_id?.toString() || teamData.league?.id?.toString() || ''
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors({ load: 'Failed to load team data' });
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadData();
    }
  }, [id]);

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

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          league_id: parseInt(formData.league_id)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update team');
      }

      // Success - redirect to teams list
      router.push('/admin/teams');
      router.refresh();

    } catch (error) {
      console.error('Error updating team:', error);
      setErrors({ submit: error.message || 'An error occurred while updating the team' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
          <p className="text-gray-600 mb-6">
            {errors.load || 'The team you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/admin/teams')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Back to Teams
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Dashboard Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedLeague = leagues.find(l => l.id === parseInt(formData.league_id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Team</h1>
              <p className="text-gray-600">
                Update the details for <span className="font-semibold text-blue-600">{team.name}</span>
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
                } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter team name"
                disabled={saving}
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
              <select
                name="league_id"
                value={formData.league_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                  errors.league_id 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                <option value="" className="text-gray-600">Select a league</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id} className="text-gray-600">
                    {league.name} {league.tournament && `(${league.tournament.name})`}
                  </option>
                ))}
              </select>
              {errors.league_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.league_id}</span>
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

            {/* Original Team Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>Original Team Information</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div><strong>Name:</strong> {team.name}</div>
                <div><strong>League:</strong> {team.league ? team.league.name : 'Not assigned'}</div>
                <div><strong>Tournament:</strong> {team.league?.tournament ? team.league.tournament.name : 'N/A'}</div>
                <div><strong>Players:</strong> {team.players ? team.players.length : 0} players</div>
                <div><strong>Created:</strong> {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>

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
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating Team...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Team</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/teams')}
                disabled={saving}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>↩️</span>
                <span>Back to Teams</span>
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span>💡</span>
                <span>About Team Management</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Teams must be assigned to a league to participate in tournaments</li>
                <li>• Changing the league will move the team to a different competition</li>
                <li>• Players remain with the team when changing leagues</li>
                <li>• Team statistics and rankings are tied to their league participation</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}