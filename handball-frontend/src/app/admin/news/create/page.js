'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileText } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function NewsForm({ news }) {
  const [title, setTitle] = useState(news?.title || '');
  const [content, setContent] = useState(news?.content || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const method = news ? 'PUT' : 'POST';
      const url = news ? `${API_URL}/news/${news.id}` : `${API_URL}/news`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to save news article');
      }

      router.push('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news article. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to News</span>
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {news ? 'Edit News Article' : 'Create New Article'}
              </h1>
              <p className="text-gray-600 text-lg">
                {news ? 'Update your existing news article' : 'Write and publish a new news article'}
              </p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-y min-h-64 text-lg leading-relaxed"
                placeholder="Write your news article content here. Be informative and engaging..."
                rows={12}
                required 
              />
              <p className="text-sm text-gray-500 mt-2">
                {content.length} characters • Write a comprehensive and engaging article
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save size={20} />
                )}
                <span>
                  {loading ? 'Saving...' : news ? 'Update Article' : 'Publish Article'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-gray-300"
              >
                <span>Cancel</span>
              </button>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <FileText className="mr-2" size={20} />
                Writing Tips
              </h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Start with a compelling headline that summarizes the news</li>
                <li>• Use clear and concise language</li>
                <li>• Include relevant details and context</li>
                <li>• Break up long paragraphs for better readability</li>
                <li>• End with a clear conclusion or call to action</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Preview Section (Optional) */}
        {title && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">{title}</h4>
              <div className="prose max-w-none text-gray-700">
                {content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph || <span className="text-gray-400">Start typing to see preview...</span>}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}