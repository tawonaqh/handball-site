'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function RefereeForm({ referee }) {
  const [formData, setFormData] = useState({
    name: '',
    tournament_id: '',
    email: '',
    phone: '',
    license_number: '',
    level: 'regional',
    is_active: true
  });
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function loadTournaments() {
      try {
        const response = await fetch(`${API_URL}/tournaments`);
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data = await response.json();
        setTournaments(data);
        
        // Initialize form with referee data if editing
        if (referee) {
          setFormData({
            name: referee.name || '',
            tournament_id: referee.tournament_id?.toString() || referee.tournament?.id?.toString() || '',
            email: referee.email || '',
            phone: referee.phone || '',
            license_number: referee.license_number || '',
            level: referee.level || 'regional',
            is_active: referee.is_active !== undefined ? referee.is_active : true
          });
        }
      } catch (error) {
        console.error('Error loading tournaments:', error);
        setErrors({ tournaments: 'Failed to load tournaments' });
      } finally {
        setTournamentsLoading(false);
      }
    }
    
    loadTournaments();
  }, [referee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      newErrors.name = 'Referee name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Referee name must be at least 2 characters';
    }

    if (!formData.tournament_id) {
      newErrors.tournament_id = 'Please select a tournament';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.license_number && formData.license_number.length < 3) {
      newErrors.license_number = 'License number must be at least 3 characters';
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
      const method = referee ? 'PUT' : 'POST';
      const url = referee 
        ? `${API_URL}/referees/${referee.id}`
        : `${API_URL}/referees`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          tournament_id: parseInt(formData.tournament_id),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          license_number: formData.license_number.trim() || null,
          level: formData.level,
          is_active: formData.is_active
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${referee ? 'update' : 'create'} referee`);
      }

      // Success - redirect to referees list
      router.push('/admin/referees');
      router.refresh();

    } catch (error) {
      console.error('Error saving referee:', error);
      setErrors({ submit: error.message || `An error occurred while ${referee ? 'updating' : 'creating'} the referee` });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/referees');
  };

  const selectedTournament = tournaments.find(t => t.id === parseInt(formData.tournament_id));
  const levelOptions = [
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'international', label: 'International' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {referee ? 'Edit Referee' : 'Create New Referee'}
              </h1>
              <p className="text-gray-600">
                {referee 
                  ? `Update "${referee.name}" referee details` 
                  : 'Create a new referee and assign them to a tournament'
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
            {/* Referee Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referee Name <span className="text-red-500">*</span>
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
                placeholder="Enter referee full name"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.tournament_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading || tournaments.length === 0}
                >
                  <option value="" className="text-gray-600">Select a tournament</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id} className="text-gray-600">
                      {tournament.name}
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

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="email@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="+1234567890"
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* License and Level Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-600 ${
                    errors.license_number 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="REF-12345"
                  disabled={loading}
                />
                {errors.license_number && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.license_number}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Referee Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200 text-gray-600"
                  disabled={loading}
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-gray-600">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label className="text-sm font-semibold text-gray-700">
                Active Referee
              </label>
            </div>

            {/* Selected Tournament Info */}
            {selectedTournament && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Selected Tournament Information</span>
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <div><strong>Tournament:</strong> {selectedTournament.name}</div>
                  {selectedTournament.description && (
                    <div><strong>Description:</strong> {selectedTournament.description}</div>
                  )}
                  {selectedTournament.start_date && (
                    <div><strong>Start Date:</strong> {new Date(selectedTournament.start_date).toLocaleDateString()}</div>
                  )}
                  {selectedTournament.end_date && (
                    <div><strong>End Date:</strong> {new Date(selectedTournament.end_date).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            )}

            {/* Current Referee Info (for edit mode) */}
            {referee && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>Current Referee Information</span>
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>Name:</strong> {referee.name}</div>
                  <div><strong>Tournament:</strong> {referee.tournament ? referee.tournament.name : 'Not assigned'}</div>
                  <div><strong>Level:</strong> {referee.level ? referee.level.charAt(0).toUpperCase() + referee.level.slice(1) : 'Regional'}</div>
                  <div><strong>Email:</strong> {referee.email || 'Not provided'}</div>
                  <div><strong>Phone:</strong> {referee.phone || 'Not provided'}</div>
                  <div><strong>License:</strong> {referee.license_number || 'Not provided'}</div>
                  <div><strong>Status:</strong> {referee.is_active ? 'Active' : 'Inactive'}</div>
                  <div><strong>Created:</strong> {referee.created_at ? new Date(referee.created_at).toLocaleDateString() : 'N/A'}</div>
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
                disabled={loading || tournaments.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{referee ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{referee ? '💾' : '✨'}</span>
                    <span>{referee ? 'Update Referee' : 'Create Referee'}</span>
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
                <span>About Referees</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Referees are assigned to tournaments and can officiate matches within those tournaments</li>
                <li>• Level indicates referee certification (Regional, National, International)</li>
                <li>• License number helps verify referee credentials</li>
                <li>• Contact information is used for match assignments and communication</li>
                <li>• Active referees can be assigned to new matches</li>
              </ul>
            </div>

            {/* Create Tournament Prompt */}
            {!referee && tournaments.length === 0 && !tournamentsLoading && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                  <span>🚨</span>
                  <span>No Tournaments Available</span>
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You need to create a tournament before you can create a referee.
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