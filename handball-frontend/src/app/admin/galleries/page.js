'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Image, 
  Video, 
  FileText, 
  Eye, 
  ExternalLink,
  Play,
  File
} from 'lucide-react';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch('http://localhost:8000/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error loading gallery:', error);
        alert('Error loading gallery items');
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/gallery/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }
      
      // Remove the item from state instead of reloading
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
    }
  }

  const getMediaIcon = (mediaType) => {
    switch (mediaType?.toLowerCase()) {
      case 'image':
        return <Image size={20} className="text-green-600" />;
      case 'video':
        return <Video size={20} className="text-red-600" />;
      case 'document':
        return <FileText size={20} className="text-blue-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  const getMediaPreview = (item) => {
    if (item.media_type?.toLowerCase() === 'image') {
      return (
        <div className="relative group">
          <img 
            src={item.media_url} 
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjRGNSIvPgo8cGF0aCBkPSJNMzIgMzZMMzYgNDBINjhWNjRIMFY0MEgyNEwyOCAzNloiIGZpbGw9IiNEOEQ5REEiLz4KPHBhdGggZD0iTTQwIDI0QzQwIDI3LjMxMzcgMzcuMzEzNyAzMCAzNCAzMEMzMC42ODYzIDMwIDI4IDI3LjMxMzcgMjggMjRDMjggMjAuNjg2MyAzMC42ODYzIDE4IDM0IDE4QzM3LjMxMzcgMTggNDAgMjAuNjg2MyA0MCAyNFoiIGZpbGw9IiNEOEQ5REEiLz4KPC9zdmc+';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Eye size={16} className="text-white" />
          </div>
        </div>
      );
    } else if (item.media_type?.toLowerCase() === 'video') {
      return (
        <div className="relative group">
          <div className="w-16 h-16 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
            <Video size={24} className="text-red-400" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Play size={16} className="text-white" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
          <FileText size={24} className="text-blue-400" />
        </div>
      );
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.media_type?.toLowerCase() === filter);

  const mediaTypeCounts = {
    all: items.length,
    image: items.filter(item => item.media_type?.toLowerCase() === 'image').length,
    video: items.filter(item => item.media_type?.toLowerCase() === 'video').length,
    document: items.filter(item => item.media_type?.toLowerCase() === 'document').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading gallery...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Manage images, videos, and documents in your media library</p>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Media Library</h2>
            <Link 
              href="/admin/gallery/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 w-full lg:w-auto"
            >
              <span>+</span>
              <span>Add New Media</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: 'all', label: 'All Media', count: mediaTypeCounts.all },
              { key: 'image', label: 'Images', count: mediaTypeCounts.image },
              { key: 'video', label: 'Videos', count: mediaTypeCounts.video },
              { key: 'document', label: 'Documents', count: mediaTypeCounts.document },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition duration-200 whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  filter === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Items */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No media items found' : `No ${filter} items found`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Get started by adding your first media item' 
                  : `No ${filter} items in your gallery yet`
                }
              </p>
              <Link 
                href="/admin/gallery/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 inline-block"
              >
                Add Media Item
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getMediaPreview(item)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getMediaIcon(item.media_type)}
                          <span className="text-sm text-gray-700 capitalize">
                            {item.media_type || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={item.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 group"
                        >
                          <span className="truncate max-w-xs">View Media</span>
                          <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/gallery/edit/${item.id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold transition duration-150 flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
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
        {items.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="text-sm text-blue-800">Total Items</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{mediaTypeCounts.image}</div>
                <div className="text-sm text-green-800">Images</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{mediaTypeCounts.video}</div>
                <div className="text-sm text-red-800">Videos</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{mediaTypeCounts.document}</div>
                <div className="text-sm text-purple-800">Documents</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}