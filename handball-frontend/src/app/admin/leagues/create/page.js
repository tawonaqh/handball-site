'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function CreateLeaguePage() {
  const [formData, setFormData] = useState({
    name: '',
    tournament_id: ''
  });
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Load tournaments for the dropdown
  useEffect(() => {
    async function loadTournaments() {
      try {
        const response = await fetch(`${API_URL}/tournaments`);
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error loading tournaments:', error);
        setErrors({ tournaments: 'Failed to load tournaments' });
      } finally {
        setTournamentsLoading(false);
      }
    }
    
    loadTournaments();
  }, []);

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

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/leagues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          tournament_id: parseInt(formData.tournament_id)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create league');
      }

      // Success - redirect to leagues list
      router.push('/admin/leagues');
      router.refresh();

    } catch (error) {
      console.error('Error creating league:', error);
      setErrors({ submit: error.message || 'An error occurred while creating the league' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New League</h1>
              <p className="text-gray-600">
                Create a new league and assign it to a tournament
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
                className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter league name (e.g., Premier League, Champions League)"
                disabled={loading}
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
              {tournamentsLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading tournaments...</span>
                </div>
              ) : errors.tournaments ? (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>{errors.tournaments}</span>
                  </p>
                </div>
              ) : (
                <select
                  name="tournament_id"
                  value={formData.tournament_id}
                  onChange={handleChange}
                  className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
                    errors.tournament_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || tournaments.length === 0}
                >
                  <option value="">Select a tournament</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name} ({new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
              {errors.tournament_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{errors.tournament_id}</span>
                </p>
              )}
              {!tournamentsLoading && tournaments.length === 0 && !errors.tournaments && (
                <p className="mt-2 text-sm text-amber-600 flex items-center space-x-2">
                  <span>💡</span>
                  <span>No tournaments available. Please create a tournament first.</span>
                </p>
              )}
            </div>

            {/* Tournament Info Preview */}
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
                disabled={loading || tournaments.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating League...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create League</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/leagues')}
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
                <span>About Leagues</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Leagues organize teams within tournaments</li>
                <li>• Each league belongs to one specific tournament</li>
                <li>• You can add multiple leagues to a single tournament</li>
                <li>• Teams are assigned to leagues for competition organization</li>
              </ul>
            </div>

            {/* Create Tournament Prompt */}
            {tournaments.length === 0 && !tournamentsLoading && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                  <span>🚨</span>
                  <span>No Tournaments Available</span>
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You need to create a tournament before you can create a league.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/tournaments/create')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
                >
                  Create Tournament First
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}