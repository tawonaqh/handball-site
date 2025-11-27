'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLeaguePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [league, setLeague] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tournament_id: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Load tournaments first
        const tournamentsResponse = await fetch('http://localhost:8000/api/tournaments');
        if (!tournamentsResponse.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const tournamentsData = await tournamentsResponse.json();
        setTournaments(tournamentsData);

        // Then load league data
        const leagueResponse = await fetch(`http://localhost:8000/api/leagues/${id}`);
        if (!leagueResponse.ok) {
          throw new Error('Failed to fetch league');
        }
        const leagueData = await leagueResponse.json();
        setLeague(leagueData);
        
        // Populate form fields with league data
        setFormData({
          name: leagueData.name || '',
          tournament_id: leagueData.tournament_id?.toString() || leagueData.tournament?.id?.toString() || ''
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors({ load: 'Failed to load data' });
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
      newErrors.name = 'League name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'League name must be at least 2 characters';
    }

    if (!formData.tournament_id) {
      newErrors.tournament_id = 'Please select a tournament';
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
      const response = await fetch(`http://localhost:8000/api/leagues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          tournament_id: parseInt(formData.tournament_id)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update league');
      }

      // Success - redirect to leagues list
      router.push('/admin/leagues');
      router.refresh();

    } catch (error) {
      console.error('Error updating league:', error);
      setErrors({ submit: error.message || 'An error occurred while updating the league' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading league data...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">League Not Found</h2>
          <p className="text-gray-600 mb-6">
            {errors.load || 'The league you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/admin/leagues')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Back to Leagues
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit League</h1>
              <p className="text-gray-600">
                Update the details for <span className="font-semibold text-blue-600">{league.name}</span>
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
            {/* League Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                League Name <span className="text-red-500">*</span>
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
                placeholder="Enter league name"
                disabled={saving}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Tournament Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tournament <span className="text-red-500">*</span>
              </label>
              <select
                name="tournament_id"
                value={formData.tournament_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                  errors.tournament_id 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                <option value="" className="text-gray-600">Select a tournament</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id} className="text-gray-600">
                    {tournament.name} ({new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
              {errors.tournament_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.tournament_id}</span>
                </p>
              )}
            </div>

            {/* Selected Tournament Info */}
            {formData.tournament_id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Selected Tournament</span>
                </h3>
                {(() => {
                  const selectedTournament = tournaments.find(t => t.id === parseInt(formData.tournament_id));
                  return selectedTournament ? (
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Name:</strong> {selectedTournament.name}</p>
                      <p><strong>Duration:</strong> {new Date(selectedTournament.start_date).toLocaleDateString()} to {new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {new Date(selectedTournament.end_date) > new Date() ? 'Active' : 'Completed'}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Original League Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>Original League Information</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {league.name}</p>
                <p><strong>Tournament:</strong> {league.tournament ? league.tournament.name : 'Not assigned'}</p>
                <p><strong>Teams:</strong> {league.teams ? league.teams.length : 0} teams</p>
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
                    <span>Updating League...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update League</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/leagues')}
                disabled={saving}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>↩️</span>
                <span>Back to Leagues</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}