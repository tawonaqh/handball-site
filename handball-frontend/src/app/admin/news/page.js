'use client';

import { useEffect, useState } from 'react';
import { fetcher } from "@/lib/api";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Eye,
  Search
} from 'lucide-react';

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetcher('news');
        setNewsList(data);
      } catch (error) {
        console.error('Error loading news:', error);
        alert('Error loading news');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/news/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news article');
      }
      
      setNewsList(newsList.filter(news => news.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Error deleting news article');
    }
  }

  const filteredNews = newsList.filter(news =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading news...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">News Management</h1>
            <p className="text-gray-600">Create, edit, and manage your news articles</p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <span>🏠</span>
            <span>Dashboard Home</span>
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">All News Articles</h2>
              <p className="text-gray-600 mt-1">
                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-gray-600 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              
              {/* Create Button */}
              <Link 
                href="/admin/news/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Create News</span>
              </Link>
            </div>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No matching news found' : 'No news articles yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by creating your first news article'
                }
              </p>
              {!searchTerm && (
                <Link 
                  href="/admin/news/create" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Create News Article</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Author & Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((news) => (
                    <tr key={news.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="text-white" size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                              {news.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {news.content}
                            </p>
                            {news.image_url && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Has Image
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-gray-400" />
                            <span>Author {news.author_id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{new Date(news.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(news.updated_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(news.updated_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/admin/news/edit/${news.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(news.id)}
                            className="text-red-600 hover:text-red-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                          <Link
                            href={`/viewer/news/${news.id}`}
                            className="text-green-600 hover:text-green-900 font-semibold transition duration-150 flex items-center space-x-1"
                            target="_blank"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </Link>
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
        {filteredNews.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{newsList.length}</div>
                <div className="text-sm text-blue-800">Total Articles</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {newsList.filter(n => n.image_url).length}
                </div>
                <div className="text-sm text-green-800">With Images</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(newsList.map(n => n.author_id)).size}
                </div>
                <div className="text-sm text-purple-800">Unique Authors</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {newsList.filter(n => new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-orange-800">Last 7 Days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}