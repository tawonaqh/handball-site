'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, FileText, Loader } from 'lucide-react';
import { fetcher } from '@/lib/api';

export default function EditNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState(null);
  const router = useRouter();
  const params = useParams();

  // Fetch news data for autofill
  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const newsData = await fetcher(`news/${params.id}`);
        setNews(newsData);
        setTitle(newsData.title || '');
        setContent(newsData.content || '');
      } catch (error) {
        console.error('Error loading news:', error);
        alert('Error loading news article');
        router.push('/admin/news');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadNews();
    }
  }, [params.id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:8000/api/news/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to update news article');
      }

      router.push('/admin/news');
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Error updating news article. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading news article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin/news')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to News</span>
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Edit News Article
              </h1>
              <p className="text-gray-600 text-lg">
                Update your existing news article
              </p>
              {news && (
                <div className="mt-2 text-sm text-gray-500">
                  Last updated: {new Date(news.updated_at).toLocaleDateString()} at {new Date(news.updated_at).toLocaleTimeString()}
                </div>
              )}
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <FileText className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Article Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg bg-white"
                placeholder="Enter a compelling title for your article..."
                required 
              />
              <p className="text-sm text-gray-500 mt-2">
                Make it engaging and descriptive to attract readers
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Article Content
              </label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-y min-h-64 text-lg leading-relaxed bg-white"
                placeholder="Write your news article content here. Be informative and engaging..."
                rows={12}
                required 
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {content.length} characters
                </p>
                <p className="text-sm text-gray-500">
                  {content.split(/\s+/).filter(word => word.length > 0).length} words
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                <span>
                  {saving ? 'Updating...' : 'Update Article'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/news')}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-gray-300"
              >
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (news) {
                    setTitle(news.title);
                    setContent(news.content);
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-yellow-300"
              >
                <span>Reset Changes</span>
              </button>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <FileText className="mr-2" size={20} />
                Editing Tips
              </h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Review and update the title to maintain relevance</li>
                <li>• Ensure content is accurate and up-to-date</li>
                <li>• Check for grammar and spelling errors</li>
                <li>• Consider adding new information if available</li>
                <li>• Maintain consistent tone and style</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h3>
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-2xl font-bold text-gray-900 mb-3">{title || 'Your article title will appear here'}</h4>
            <div className="prose max-w-none text-gray-700">
              {content ? (
                content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 italic">Start typing to see your article preview...</p>
              )}
            </div>
            {content && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <strong>Article Stats:</strong> {content.split(/\s+/).filter(word => word.length > 0).length} words • 
                  Approximately {Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)} minute read
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Original Content Reference */}
        {news && (title !== news.title || content !== news.content) && (
          <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">Changes Detected</h4>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>You have unsaved changes to this article.</p>
              {(title !== news.title) && (
                <p><strong>Title:</strong> Modified from original</p>
              )}
              {(content !== news.content) && (
                <p><strong>Content:</strong> {Math.abs(content.length - news.content.length)} characters difference</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}