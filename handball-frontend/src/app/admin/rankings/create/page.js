'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function CreateRankingPage() {
  const [formData, setFormData] = useState({
    league_id: '',
    team_id: '',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // Load leagues and teams in parallel
        const [leaguesResponse, teamsResponse] = await Promise.all([
          fetch(`${API_URL}/leagues`),
          fetch(`${API_URL}/teams`)
        ]);

        if (!leaguesResponse.ok || !teamsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const leaguesData = await leaguesResponse.json();
        const teamsData = await teamsResponse.json();

        setLeagues(leaguesData);
        setTeams(teamsData);
        setFilteredTeams(teamsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors({ load: 'Failed to load data' });
      } finally {
        setDataLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filter teams when league changes
  useEffect(() => {
    if (formData.league_id) {
      const filtered = teams.filter(team => team.league_id === parseInt(formData.league_id));
      setFilteredTeams(filtered);
      
      // Clear team selection if it's not in the filtered list
      if (formData.team_id && !filtered.find(t => t.id === parseInt(formData.team_id))) {
        setFormData(prev => ({ ...prev, team_id: '' }));
      }
    } else {
      setFilteredTeams(teams);
    }
  }, [formData.league_id, teams]);

  // Auto-calculate points and validate matches
  useEffect(() => {
    const wins = parseInt(formData.wins) || 0;
    const draws = parseInt(formData.draws) || 0;
    const losses = parseInt(formData.losses) || 0;
    const played = parseInt(formData.played) || 0;

    // Calculate points (2 for win, 1 for draw)
    const calculatedPoints = (wins * 2) + draws;
    
    // Validate that wins + draws + losses equals played
    const totalMatches = wins + draws + losses;
    
    setFormData(prev => ({
      ...prev,
      points: calculatedPoints
    }));

    // Set validation errors
    if (played !== totalMatches) {
      setErrors(prev => ({
        ...prev,
        matches: 'Wins + Draws + Losses must equal Matches Played'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        matches: ''
      }));
    }
  }, [formData.wins, formData.draws, formData.losses, formData.played]);

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

    if (!formData.league_id) {
      newErrors.league_id = 'Please select a league';
    }

    if (!formData.team_id) {
      newErrors.team_id = 'Please select a team';
    }

    const wins = parseInt(formData.wins) || 0;
    const draws = parseInt(formData.draws) || 0;
    const losses = parseInt(formData.losses) || 0;
    const played = parseInt(formData.played) || 0;

    if (played < 0) newErrors.played = 'Matches played cannot be negative';
    if (wins < 0) newErrors.wins = 'Wins cannot be negative';
    if (draws < 0) newErrors.draws = 'Draws cannot be negative';
    if (losses < 0) newErrors.losses = 'Losses cannot be negative';
    if (formData.goals_for < 0) newErrors.goals_for = 'Goals for cannot be negative';
    if (formData.goals_against < 0) newErrors.goals_against = 'Goals against cannot be negative';

    if (wins + draws + losses !== played) {
      newErrors.matches = 'Wins + Draws + Losses must equal Matches Played';
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
      const payload = {
        league_id: parseInt(formData.league_id),
        team_id: parseInt(formData.team_id),
        played: formData.played,
        wins: formData.wins,
        draws: formData.draws,
        losses: formData.losses,
        goals_for: formData.goals_for,
        goals_against: formData.goals_against,
        points: formData.points
      };

      const response = await fetch(`${API_URL}/rankings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create ranking');
      }

      // Success - redirect to rankings list
      router.push('/admin/rankings');
      router.refresh();

    } catch (error) {
      console.error('Error creating ranking:', error);
      setErrors({ submit: error.message || 'An error occurred while creating the ranking' });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/rankings');
  };

  const selectedTeam = teams.find(t => t.id === parseInt(formData.team_id));
  const selectedLeague = leagues.find(l => l.id === parseInt(formData.league_id));
  const goalDifference = (formData.goals_for || 0) - (formData.goals_against || 0);
  const winRate = formData.played > 0 ? ((formData.wins || 0) / formData.played * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Ranking</h1>
              <p className="text-gray-600">
                Add team statistics and standings for a league
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
            {/* League and Team Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team <span className="text-red-500">*</span>
                </label>
                <select
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.team_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || filteredTeams.length === 0}
                >
                  <option value="" className="text-gray-600">Select a team</option>
                  {filteredTeams.map((team) => (
                    <option key={team.id} value={team.id} className="text-gray-600">
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.team_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.team_id}</span>
                  </p>
                )}
                {!dataLoading && filteredTeams.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 flex items-center space-x-2">
                    <span>💡</span>
                    <span>No teams available for selected league</span>
                  </p>
                )}
              </div>
            </div>

            {/* Selected Team Info */}
            {selectedTeam && selectedLeague && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Team & League Information</span>
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <div><strong>Team:</strong> {selectedTeam.name}</div>
                  <div><strong>League:</strong> {selectedLeague.name}</div>
                  {selectedLeague.tournament && (
                    <div><strong>Tournament:</strong> {selectedLeague.tournament.name}</div>
                  )}
                </div>
              </div>
            )}

            {/* Match Statistics */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Statistics</h3>
              
              {/* Matches Played */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Matches Played <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="played"
                  value={formData.played}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.played 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.played && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.played}</span>
                  </p>
                )}
              </div>

              {/* Win/Draw/Loss Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Wins</label>
                  <input
                    type="number"
                    name="wins"
                    value={formData.wins}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.wins ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.wins && (
                    <p className="mt-2 text-sm text-red-600">{errors.wins}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Draws</label>
                  <input
                    type="number"
                    name="draws"
                    value={formData.draws}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.draws ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.draws && (
                    <p className="mt-2 text-sm text-red-600">{errors.draws}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Losses</label>
                  <input
                    type="number"
                    name="losses"
                    value={formData.losses}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.losses ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.losses && (
                    <p className="mt-2 text-sm text-red-600">{errors.losses}</p>
                  )}
                </div>
              </div>

              {/* Match Validation */}
              {errors.matches && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-red-700 flex items-center space-x-2">
                    <span>❌</span>
                    <span>{errors.matches}</span>
                  </p>
                </div>
              )}

              {/* Goals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Goals For</label>
                  <input
                    type="number"
                    name="goals_for"
                    value={formData.goals_for}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.goals_for ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.goals_for && (
                    <p className="mt-2 text-sm text-red-600">{errors.goals_for}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Goals Against</label>
                  <input
                    type="number"
                    name="goals_against"
                    value={formData.goals_against}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                      errors.goals_against ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                  {errors.goals_against && (
                    <p className="mt-2 text-sm text-red-600">{errors.goals_against}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Calculated Statistics */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span>📊</span>
                <span>Calculated Statistics</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{formData.points}</div>
                  <div className="text-xs text-gray-600">Points</div>
                  <div className="text-xs text-gray-500">(2 for win, 1 for draw)</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    goalDifference > 0 ? 'text-green-600' : goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {goalDifference > 0 ? '+' : ''}{goalDifference}
                  </div>
                  <div className="text-xs text-gray-600">Goal Diff</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{winRate}%</div>
                  <div className="text-xs text-gray-600">Win Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formData.played > 0 ? (formData.goals_for / formData.played).toFixed(1) : 0}
                  </div>
                  <div className="text-xs text-gray-600">Goals/Match</div>
                </div>
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
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Ranking...</span>
                  </>
                ) : (
                  <>
                    <span>🏆</span>
                    <span>Create Ranking</span>
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
                <span>About Rankings</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Points are automatically calculated (2 points for win, 1 point for draw)</li>
                <li>• Wins + Draws + Losses must equal Matches Played</li>
                <li>• Goal difference is calculated as Goals For minus Goals Against</li>
                <li>• Win rate shows the percentage of matches won</li>
                <li>• Teams are automatically filtered by selected league</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}