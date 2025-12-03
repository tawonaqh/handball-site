'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function TournamentForm({ tournament }) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Initialize form with tournament data
  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || '',
        startDate: tournament.start_date ? tournament.start_date.slice(0, 10) : '',
        endDate: tournament.end_date ? tournament.end_date.slice(0, 10) : ''
      });
    }
  }, [tournament]);

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
      newErrors.name = 'Tournament name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tournament name must be at least 2 characters';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }

      // Optional: Add minimum tournament duration validation
      const minDuration = 1; // 1 day minimum
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      if (dayDiff < minDuration) {
        newErrors.endDate = 'Tournament must last at least 1 day';
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
      const method = tournament ? 'PUT' : 'POST';
      const url = tournament
        ? `${API_URL}/tournaments/${tournament.id}`
        : `${API_URL}/tournaments`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          start_date: formData.startDate,
          end_date: formData.endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${tournament ? 'update' : 'create'} tournament`);
      }

      router.push('/admin/tournaments');
      router.refresh(); // Refresh the current route

    } catch (error) {
      console.error('Error saving tournament:', error);
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.push('/admin/tournaments');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tournament ? 'Edit Tournament' : 'Create New Tournament'}
              </h1>
              <p className="text-gray-600">
                {tournament 
                  ? 'Update your tournament details below' 
                  : 'Fill in the details to create a new tournament'
                }
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tournament Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tournament Name <span className="text-red-500">*</span>
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
                placeholder="Enter tournament name"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
                    errors.startDate 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.startDate}</span>
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
                    errors.endDate 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.endDate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Original Dates Info (only for edit mode) */}
            {tournament && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Dates</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start:</span>{' '}
                    <span className="font-medium text-gray-600">
                      {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">End:</span>{' '}
                    <span className="font-medium text-gray-600">
                      {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
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
                    <span>{tournament ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{tournament ? '💾' : '✨'}</span>
                    <span>{tournament ? 'Update Tournament' : 'Create Tournament'}</span>
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
                <span>{tournament ? 'Back to List' : 'Cancel'}</span>
              </button>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-1">
                <span>💡</span>
                <span>Quick Tips</span>
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Choose a descriptive name that players will recognize</li>
                <li>• Ensure the end date is after the start date</li>
                <li>• Consider tournament duration when setting dates</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}