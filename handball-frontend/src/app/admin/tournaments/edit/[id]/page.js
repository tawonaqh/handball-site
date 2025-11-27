'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    async function loadTournament() {
      try {
        const response = await fetch(`http://localhost:8000/api/tournaments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tournament');
        }
        const data = await response.json();
        setTournament(data);
        
        // Populate form fields
        setFormData({
          name: data.name || '',
          startDate: data.start_date ? data.start_date.slice(0, 10) : '',
          endDate: data.end_date ? data.end_date.slice(0, 10) : ''
        });
      } catch (error) {
        console.error('Error loading tournament:', error);
        setErrors({ load: 'Failed to load tournament data' });
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadTournament();
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

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch(`http://localhost:8000/api/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          start_date: formData.startDate,
          end_date: formData.endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update tournament');
      }

      // Success - redirect to tournaments list
      router.push('/admin/tournaments');
      router.refresh();

    } catch (error) {
      console.error('Error updating tournament:', error);
      setErrors({ submit: error.message || 'An error occurred while updating the tournament' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tournament Not Found</h2>
          <p className="text-gray-600 mb-6">
            {errors.load || 'The tournament you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/admin/tournaments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Back to Tournaments
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tournament</h1>
              <p className="text-gray-600">
                Update the details for <span className="font-semibold text-blue-600">{tournament.name}</span>
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
                } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter tournament name"
                disabled={saving}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={saving}
                />
                {errors.startDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
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
                  } ${saving ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={saving}
                />
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{errors.endDate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Original Dates Info */}
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
                    <span>Updating Tournament...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Tournament</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/tournaments')}
                disabled={saving}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>↩️</span>
                <span>Back to List</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}