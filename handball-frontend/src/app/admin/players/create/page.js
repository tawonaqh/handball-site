'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayerForm({ player }) {
  const [formData, setFormData] = useState({
    name: '',
    team_id: '',
    position: '',
    bio: '',
    goals: 0,
    assists: 0,
    matches_played: 0
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch('http://localhost:8000/api/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data);
        
        // Initialize form with player data if editing
        if (player) {
          setFormData({
            name: player.name || '',
            team_id: player.team_id?.toString() || player.team?.id?.toString() || '',
            position: player.position || '',
            bio: player.bio || '',
            goals: player.goals || 0,
            assists: player.assists || 0,
            matches_played: player.matches_played || 0
          });
        }
      } catch (error) {
        console.error('Error loading teams:', error);
        setErrors({ teams: 'Failed to load teams' });
      } finally {
        setTeamsLoading(false);
      }
    }
    
    loadTeams();
  }, [player]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
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
      newErrors.name = 'Player name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Player name must be at least 2 characters';
    }

    if (!formData.team_id) {
      newErrors.team_id = 'Please select a team';
    }

    if (formData.goals < 0) {
      newErrors.goals = 'Goals cannot be negative';
    }

    if (formData.assists < 0) {
      newErrors.assists = 'Assists cannot be negative';
    }

    if (formData.matches_played < 0) {
      newErrors.matches_played = 'Matches played cannot be negative';
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
      const method = player ? 'PUT' : 'POST';
      const url = player 
        ? `http://localhost:8000/api/players/${player.id}`
        : 'http://localhost:8000/api/players';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          team_id: parseInt(formData.team_id),
          position: formData.position,
          bio: formData.bio,
          goals: formData.goals,
          assists: formData.assists,
          matches_played: formData.matches_played
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${player ? 'update' : 'create'} player`);
      }

      // Success - redirect to players list
      router.push('/admin/players');
      router.refresh();

    } catch (error) {
      console.error('Error saving player:', error);
      setErrors({ submit: error.message || `An error occurred while ${player ? 'updating' : 'creating'} the player` });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/players');
  };

  const selectedTeam = teams.find(t => t.id === parseInt(formData.team_id));
  const positionOptions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {player ? 'Edit Player' : 'Create New Player'}
              </h1>
              <p className="text-gray-600">
                {player 
                  ? `Update "${player.name}" player details` 
                  : 'Create a new player and assign them to a team'
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
            {/* Player Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Player Name <span className="text-red-500">*</span>
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
                placeholder="Enter player full name"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Team Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team <span className="text-red-500">*</span>
              </label>
              {teamsLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading teams...</span>
                </div>
              ) : errors.teams ? (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>{errors.teams}</span>
                  </p>
                </div>
              ) : (
                <select
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.team_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || teams.length === 0}
                >
                  <option value="" className="text-gray-600">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id} className="text-gray-600">
                      {team.name} {team.league && `(${team.league.name})`}
                    </option>
                  ))}
                </select>
              )}
              {errors.team_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.team_id}</span>
                </p>
              )}
              {!teamsLoading && teams.length === 0 && !errors.teams && (
                <p className="mt-2 text-sm text-amber-600 flex items-center space-x-2">
                  <span>💡</span>
                  <span>No teams available. Please create a team first.</span>
                </p>
              )}
            </div>

            {/* Position Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200 text-gray-600"
                disabled={loading}
              >
                <option value="" className="text-gray-600">Select position (optional)</option>
                {positionOptions.map((position) => (
                  <option key={position} value={position} className="text-gray-600">
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Goals
                </label>
                <input
                  type="number"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.goals 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.goals && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.goals}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assists
                </label>
                <input
                  type="number"
                  name="assists"
                  value={formData.assists}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.assists 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.assists && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.assists}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Matches Played
                </label>
                <input
                  type="number"
                  name="matches_played"
                  value={formData.matches_played}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.matches_played 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.matches_played && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.matches_played}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200 text-gray-600"
                placeholder="Enter player biography or description (optional)"
                disabled={loading}
              />
            </div>

            {/* Selected Team Info */}
            {selectedTeam && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Selected Team Information</span>
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <div><strong>Team:</strong> {selectedTeam.name}</div>
                  {selectedTeam.league && (
                    <div><strong>League:</strong> {selectedTeam.league.name}</div>
                  )}
                  {selectedTeam.league?.tournament && (
                    <div><strong>Tournament:</strong> {selectedTeam.league.tournament.name}</div>
                  )}
                  {selectedTeam.players && (
                    <div><strong>Current Players:</strong> {selectedTeam.players.length} players</div>
                  )}
                </div>
              </div>
            )}

            {/* Current Player Info (for edit mode) */}
            {player && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>Current Player Information</span>
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>Name:</strong> {player.name}</div>
                  <div><strong>Team:</strong> {player.team ? player.team.name : 'Not assigned'}</div>
                  <div><strong>Position:</strong> {player.position || 'Not set'}</div>
                  <div><strong>Goals:</strong> {player.goals || 0}</div>
                  <div><strong>Assists:</strong> {player.assists || 0}</div>
                  <div><strong>Matches:</strong> {player.matches_played || 0}</div>
                  <div><strong>Created:</strong> {player.created_at ? new Date(player.created_at).toLocaleDateString() : 'N/A'}</div>
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
                disabled={loading || teams.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{player ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{player ? '💾' : '✨'}</span>
                    <span>{player ? 'Update Player' : 'Create Player'}</span>
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
                <span>About Players</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Players are assigned to teams and can participate in matches</li>
                <li>• Position helps identify player role (Goalkeeper, Defender, Midfielder, Forward)</li>
                <li>• Statistics track player performance across matches</li>
                <li>• Bio can include player background, strengths, or achievements</li>
              </ul>
            </div>

            {/* Create Team Prompt */}
            {!player && teams.length === 0 && !teamsLoading && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                  <span>🚨</span>
                  <span>No Teams Available</span>
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You need to create a team before you can create a player.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/teams/create')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
                >
                  Create Team First
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}