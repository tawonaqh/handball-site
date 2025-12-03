'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminReferees() {
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadReferees() {
      try {
        const response = await fetch(`${API_URL}/referees`);
        if (!response.ok) {
          throw new Error('Failed to fetch referees');
        }
        const data = await response.json();
        setReferees(data);
      } catch (error) {
        console.error('Error loading referees:', error);
        alert('Error loading referees');
      } finally {
        setLoading(false);
      }
    }
    loadReferees();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this referee? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/referees/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete referee');
      }
      
      // Remove the referee from state instead of reloading
      setReferees(referees.filter(referee => referee.id !== id));
    } catch (error) {
      console.error('Error deleting referee:', error);
      alert('Error deleting referee');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading referees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Referee Management</h1>
            <p className="text-gray-600">Create, edit, and manage your referees</p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
          >
            🏠 Dashboard Home
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">All Referees</h2>
            <Link 
              href="/admin/referees/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Referee</span>
            </Link>
          </div>
        </div>

        {/* Referees Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {referees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No referees found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first referee</p>
              <Link 
                href="/admin/referees/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Create Referee
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Referee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tournament & Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referees.map((referee) => (
                    <tr key={referee.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {referee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{referee.name}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(referee.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          referee.level === 'international' ? 'bg-purple-100 text-purple-800' :
                          referee.level === 'national' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {referee.level?.charAt(0).toUpperCase() + referee.level?.slice(1) || 'Regional'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {referee.tournament ? (
                            <div className="space-y-1">
                              <div className="font-medium">{referee.tournament.name}</div>
                              <div className="text-xs text-gray-500 space-y-1">
                                {referee.email && (
                                  <div>📧 {referee.email}</div>
                                )}
                                {referee.phone && (
                                  <div>📞 {referee.phone}</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No tournament</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 space-y-1">
                          <div className="flex space-x-4 text-xs">
                            <div className="text-center">
                              <div className="font-bold text-gray-900">{referee.games?.length || 0}</div>
                              <div className="text-gray-500">Matches</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600">
                                {referee.is_active ? 'Active' : 'Inactive'}
                              </div>
                              <div className="text-gray-500">Status</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-blue-600">
                                {referee.license_number || 'No license'}
                              </div>
                              <div className="text-gray-500">License</div>
                            </div>
                          </div>
                          {referee.license_number && (
                            <div className="text-xs text-gray-500">
                              License: {referee.license_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/referees/edit/${referee.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(referee.id)}
                            className="text-red-600 hover:text-red-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {referees.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{referees.length}</div>
                <div className="text-sm text-blue-800">Total Referees</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {referees.filter(r => r.is_active).length}
                </div>
                <div className="text-sm text-green-800">Active Referees</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {referees.filter(r => r.level === 'international').length}
                </div>
                <div className="text-sm text-purple-800">International Level</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {referees.reduce((total, referee) => total + (referee.games?.length || 0), 0)}
                </div>
                <div className="text-sm text-orange-800">Total Matches</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}