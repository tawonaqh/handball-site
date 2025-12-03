'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function EditRefereePage() {
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
  const [referee, setReferee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load tournaments
        const tournamentsResponse = await fetch(`${API_URL}/tournaments`);
        if (!tournamentsResponse.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const tournamentsData = await tournamentsResponse.json();
        setTournaments(tournamentsData);
        setTournamentsLoading(false);

        // Load referee data
        const refereeResponse = await fetch(`${API_URL}/referees/${params.id}`);
        if (!refereeResponse.ok) {
          throw new Error('Failed to fetch referee');
        }
        const refereeData = await refereeResponse.json();
        setReferee(refereeData);

        // Initialize form with referee data
        setFormData({
          name: refereeData.name || '',
          tournament_id: refereeData.tournament_id?.toString() || refereeData.tournament?.id?.toString() || '',
          email: refereeData.email || '',
          phone: refereeData.phone || '',
          license_number: refereeData.license_number || '',
          level: refereeData.level || 'regional',
          is_active: refereeData.is_active !== undefined ? refereeData.is_active : true
        });

      } catch (error) {
        console.error('Error loading data:', error);
        setErrors({ load: error.message || 'Failed to load referee data' });
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadData();
    }
  }, [params.id]);

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

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/referees/${params.id}`, {
        method: 'PUT',
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
        throw new Error(errorData.message || 'Failed to update referee');
      }

      // Success - redirect to referees list
      router.push('/admin/referees');
      router.refresh();

    } catch (error) {
      console.error('Error updating referee:', error);
      setErrors({ submit: error.message || 'An error occurred while updating the referee' });
    } finally {
      setSaving(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/referees');
  };

  const handleReset = () => {
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
    setErrors({});
  };

  const selectedTournament = tournaments.find(t => t.id === parseInt(formData.tournament_id));
  const levelOptions = [
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'international', label: 'International' }
  ];

  const hasChanges = referee && (
    formData.name !== referee.name ||
    formData.tournament_id !== (referee.tournament_id?.toString() || referee.tournament?.id?.toString() || '') ||
    formData.email !== (referee.email || '') ||
    formData.phone !== (referee.phone || '') ||
    formData.license_number !== (referee.license_number || '') ||
    formData.level !== (referee.level || 'regional') ||
    formData.is_active !== (referee.is_active !== undefined ? referee.is_active : true)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading referee data...</p>
        </div>
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Referee</h2>
          <p className="text-gray-600 mb-6">{errors.load}</p>
          <button
            onClick={() => router.push('/admin/referees')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            Back to Referees
          </button>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Referee
              </h1>
              <p className="text-gray-600">
                Update "{referee?.name}" referee details
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
                } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter referee full name"
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={saving || tournaments.length === 0}
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="email@example.com"
                  disabled={saving}
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="+1234567890"
                  disabled={saving}
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="REF-12345"
                  disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
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

            {/* Original Referee Info */}
            {referee && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>Original Referee Information</span>
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
                  <div><strong>Last Updated:</strong> {referee.updated_at ? new Date(referee.updated_at).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            )}

            {/* Changes Detected */}
            {hasChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
                  <span>🔄</span>
                  <span>Changes Detected</span>
                </h3>
                <p className="text-sm text-yellow-700">
                  You have unsaved changes to this referee. Make sure to save your changes before leaving.
                </p>
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
                disabled={saving || !hasChanges}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Referee</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={saving || !hasChanges}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>Reset Changes</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
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
                <span>Editing Referees</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Update referee details to keep information current and accurate</li>
                <li>• Changing tournament assignment affects which matches the referee can officiate</li>
                <li>• License number updates help maintain credential verification</li>
                <li>• Set referee status to inactive if they are no longer available for matches</li>
                <li>• Contact information updates ensure proper communication for match assignments</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}