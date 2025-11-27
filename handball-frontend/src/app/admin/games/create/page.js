'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GameForm({ game }) {
  const [formData, setFormData] = useState({
    league_id: '',
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    home_score: '',
    away_score: '',
    status: 'scheduled',
    referee_id: ''
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [referees, setReferees] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'postponed', label: 'Postponed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        // Load leagues, teams, and referees in parallel
        const [leaguesResponse, teamsResponse, refereesResponse] = await Promise.all([
          fetch('http://localhost:8000/api/leagues'),
          fetch('http://localhost:8000/api/teams'),
          fetch('http://localhost:8000/api/referees') // Add referees API call
        ]);

        if (!leaguesResponse.ok || !teamsResponse.ok || !refereesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const leaguesData = await leaguesResponse.json();
        const teamsData = await teamsResponse.json();
        const refereesData = await refereesResponse.json();

        setLeagues(leaguesData);
        setTeams(teamsData);
        setReferees(refereesData);
        setFilteredTeams(teamsData);
        
        // Initialize form with game data if editing
        if (game) {
          setFormData({
            league_id: game.league_id?.toString() || game.league?.id?.toString() || '',
            home_team_id: game.home_team_id?.toString() || game.home_team?.id?.toString() || '',
            away_team_id: game.away_team_id?.toString() || game.away_team?.id?.toString() || '',
            match_date: game.match_date ? game.match_date.slice(0, 16) : '',
            home_score: game.home_score || '',
            away_score: game.away_score || '',
            status: game.status || 'scheduled',
            referee_id: game.referee_id?.toString() || game.referee?.id?.toString() || ''
          });

          // Filter teams based on game's league if available
          if (game.league_id || game.league?.id) {
            const leagueId = game.league_id || game.league?.id;
            const filtered = teamsData.filter(team => team.league_id === leagueId);
            setFilteredTeams(filtered);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors({ load: 'Failed to load data' });
      } finally {
        setDataLoading(false);
      }
    }
    
    loadData();
  }, [game]);

  // Filter teams when league changes
  useEffect(() => {
    if (formData.league_id) {
      const filtered = teams.filter(team => team.league_id === parseInt(formData.league_id));
      setFilteredTeams(filtered);
      
      // Clear team selections if they're not in the filtered list
      if (formData.home_team_id && !filtered.find(t => t.id === parseInt(formData.home_team_id))) {
        setFormData(prev => ({ ...prev, home_team_id: '' }));
      }
      if (formData.away_team_id && !filtered.find(t => t.id === parseInt(formData.away_team_id))) {
        setFormData(prev => ({ ...prev, away_team_id: '' }));
      }
    } else {
      setFilteredTeams(teams);
    }
  }, [formData.league_id, teams]);

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

    if (!formData.league_id) {
      newErrors.league_id = 'Please select a league';
    }

    if (!formData.home_team_id) {
      newErrors.home_team_id = 'Please select home team';
    }

    if (!formData.away_team_id) {
      newErrors.away_team_id = 'Please select away team';
    }

    if (formData.home_team_id === formData.away_team_id && formData.home_team_id) {
      newErrors.away_team_id = 'Home and away teams cannot be the same';
    }

    if (!formData.match_date) {
      newErrors.match_date = 'Match date is required';
    } else if (new Date(formData.match_date) < new Date()) {
      // Optional: Warn about past dates but don't block
      console.warn('Match date is in the past');
    }

    if (formData.status === 'completed') {
      if (formData.home_score === '' || formData.away_score === '') {
        newErrors.home_score = 'Scores are required for completed games';
        newErrors.away_score = 'Scores are required for completed games';
      } else if (parseInt(formData.home_score) < 0 || parseInt(formData.away_score) < 0) {
        newErrors.home_score = 'Scores cannot be negative';
        newErrors.away_score = 'Scores cannot be negative';
      }
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
      const method = game ? 'PUT' : 'POST';
      const url = game 
        ? `http://localhost:8000/api/games/${game.id}`
        : 'http://localhost:8000/api/games';

      const payload = {
        league_id: formData.league_id ? parseInt(formData.league_id) : null,
        home_team_id: parseInt(formData.home_team_id),
        away_team_id: parseInt(formData.away_team_id),
        match_date: formData.match_date,
        status: formData.status,
        home_score: formData.home_score ? parseInt(formData.home_score) : null,
        away_score: formData.away_score ? parseInt(formData.away_score) : null,
        referee_id: formData.referee_id ? parseInt(formData.referee_id) : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${game ? 'update' : 'create'} game`);
      }

      // Success - redirect to games list
      router.push('/admin/games');
      router.refresh();

    } catch (error) {
      console.error('Error saving game:', error);
      setErrors({ submit: error.message || `An error occurred while ${game ? 'updating' : 'creating'} the game` });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/games');
  };

  const selectedHomeTeam = teams.find(t => t.id === parseInt(formData.home_team_id));
  const selectedAwayTeam = teams.find(t => t.id === parseInt(formData.away_team_id));
  const selectedLeague = leagues.find(l => l.id === parseInt(formData.league_id));
  const selectedReferee = referees.find(r => r.id === parseInt(formData.referee_id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {game ? 'Edit Game' : 'Schedule New Game'}
              </h1>
              <p className="text-gray-600">
                {game 
                  ? `Update match details` 
                  : 'Schedule a new match between two teams'
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
            {/* League Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                League <span className="text-red-500">*</span>
              </label>
              {dataLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading leagues...</span>
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
                  disabled={loading}
                >
                  <option value="" className="text-gray-600">Select a league (optional)</option>
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
            </div>

            {/* Teams Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Team <span className="text-red-500">*</span>
                </label>
                <select
                  name="home_team_id"
                  value={formData.home_team_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.home_team_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || filteredTeams.length === 0}
                >
                  <option value="" className="text-gray-600">Select home team</option>
                  {filteredTeams.map((team) => (
                    <option key={team.id} value={team.id} className="text-gray-600">
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.home_team_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.home_team_id}</span>
                  </p>
                )}
              </div>

              {/* Away Team */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Away Team <span className="text-red-500">*</span>
                </label>
                <select
                  name="away_team_id"
                  value={formData.away_team_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.away_team_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || filteredTeams.length === 0}
                >
                  <option value="" className="text-gray-600">Select away team</option>
                  {filteredTeams.map((team) => (
                    <option key={team.id} value={team.id} className="text-gray-600">
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.away_team_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.away_team_id}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Match Preview */}
            {(selectedHomeTeam || selectedAwayTeam) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <span>⚽</span>
                  <span>Match Preview</span>
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center flex-1">
                    <div className="font-semibold text-blue-700">{selectedHomeTeam?.name || 'TBD'}</div>
                    <div className="text-blue-600 text-xs mt-1">Home</div>
                  </div>
                  <div className="mx-4 text-xl font-bold text-gray-600">VS</div>
                  <div className="text-center flex-1">
                    <div className="font-semibold text-blue-700">{selectedAwayTeam?.name || 'TBD'}</div>
                    <div className="text-blue-600 text-xs mt-1">Away</div>
                  </div>
                </div>
                {selectedLeague && (
                  <div className="mt-3 text-xs text-blue-600 text-center">
                    {selectedLeague.name}
                    {selectedLeague.tournament && ` • ${selectedLeague.tournament.name}`}
                  </div>
                )}
              </div>
            )}

            {/* Match Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Match Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="match_date"
                value={formData.match_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                  errors.match_date 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
              {errors.match_date && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.match_date}</span>
                </p>
              )}
            </div>

            {/* Referee Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referee (Optional)
              </label>
              {dataLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading referees...</span>
                </div>
              ) : (
                <select
                  name="referee_id"
                  value={formData.referee_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200 text-gray-600"
                  disabled={loading}
                >
                  <option value="" className="text-gray-600">Select a referee (optional)</option>
                  {referees.map((referee) => (
                    <option key={referee.id} value={referee.id} className="text-gray-600">
                      {referee.name} {referee.experience_level && `- ${referee.experience_level}`}
                    </option>
                  ))}
                </select>
              )}
              {selectedReferee && (
                <div className="mt-2 text-sm text-gray-600 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-bold">👤</span>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-700">{selectedReferee.name}</div>
                      {selectedReferee.experience_level && (
                        <div className="text-xs text-purple-600">Level: {selectedReferee.experience_level}</div>
                      )}
                      {selectedReferee.email && (
                        <div className="text-xs text-purple-500">{selectedReferee.email}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200 text-gray-600"
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value} className="text-gray-600">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scores - Conditionally shown for completed/live games */}
            {(formData.status === 'completed' || formData.status === 'live') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Home Score {formData.status === 'completed' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    name="home_score"
                    value={formData.home_score}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.home_score 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.home_score && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{errors.home_score}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Away Score {formData.status === 'completed' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    name="away_score"
                    value={formData.away_score}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.away_score 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.away_score && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{errors.away_score}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Current Game Info (for edit mode) */}
            {game && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>Current Game Information</span>
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>Home Team:</strong> {game.home_team?.name || 'Not set'}</div>
                  <div><strong>Away Team:</strong> {game.away_team?.name || 'Not set'}</div>
                  <div><strong>League:</strong> {game.league?.name || 'Not assigned'}</div>
                  <div><strong>Date:</strong> {game.match_date ? new Date(game.match_date).toLocaleString() : 'Not set'}</div>
                  <div><strong>Status:</strong> {game.status || 'Scheduled'}</div>
                  <div><strong>Referee:</strong> {game.referee?.name || 'Not assigned'}</div>
                  {game.home_score !== null && game.away_score !== null && (
                    <div><strong>Score:</strong> {game.home_score} - {game.away_score}</div>
                  )}
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
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{game ? 'Updating...' : 'Scheduling...'}</span>
                  </>
                ) : (
                  <>
                    <span>{game ? '💾' : '📅'}</span>
                    <span>{game ? 'Update Game' : 'Schedule Game'}</span>
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
                <span>About Game Scheduling</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select a league to filter teams from that competition</li>
                <li>• Scores are required only for completed games</li>
                <li>• Live games can have partial scores updated in real-time</li>
                <li>• Scheduled games will show "VS" until scores are entered</li>
                <li>• Teams must be from the same league when league is selected</li>
                <li>• Assigning a referee is optional but recommended for better tracking</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}