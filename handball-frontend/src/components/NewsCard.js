// src/components/NewsCard.js
import Link from 'next/link';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

export default function NewsCard({ news }) {
  // Calculate reading time (approximately 200 words per minute)
  const wordCount = news.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/viewer/news/${news.id}`}>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="p-6">
          {/* Header with metadata */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar size={16} className="text-orange-500" />
                <span>{formatDate(news.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} className="text-blue-500" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            {news.author_id && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <User size={16} className="text-green-500" />
                <span>Author {news.author_id}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
            {news.title}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
            {news.content}
          </p>

          {/* Footer with read more */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {/* Word count badge */}
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {wordCount} words
              </span>
              
              {/* Updated indicator if recently updated */}
              {news.updated_at && news.updated_at !== news.created_at && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Updated
                </span>
              )}
            </div>
            
            {/* Read more link */}
            <div className="flex items-center space-x-1 text-orange-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
              <span className="text-sm">Read more</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Hover effect border */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
}