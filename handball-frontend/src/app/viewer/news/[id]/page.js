import { fetcher } from "@/lib/api";
import ViewerLayout from "@/components/ViewerLayout";
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share, Bookmark } from 'lucide-react';

export default async function NewsDetail({ params }) {
  const article = await fetcher(`news/${params.id}`);

  // Calculate reading time
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/viewer/news"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to News</span>
            </Link>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* Article Metadata */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-orange-500" />
                  <span className="font-medium">{formatDate(article.created_at)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-blue-500" />
                  <span className="font-medium">{readingTime} min read</span>
                </div>
                
                {article.author_id && (
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-green-500" />
                    <span className="font-medium">Author {article.author_id}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center space-x-4">
                <button className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition-colors duration-200">
                  <Share size={18} />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
                  <Bookmark size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Article Stats */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 text-center">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{wordCount}</div>
                  <div className="text-gray-600">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{readingTime}</div>
                  <div className="text-gray-600">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">
                    {Math.ceil(wordCount / 5)}
                  </div>
                  <div className="text-gray-600">Sentences</div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <article className="prose prose-lg max-w-none">
              {/* Content with proper formatting */}
              <div className="text-gray-800 leading-relaxed text-lg space-y-6">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            {/* Last Updated */}
            {article.updated_at && article.updated_at !== article.created_at && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date(article.updated_at).toLocaleDateString()} at {' '}
                  {new Date(article.updated_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Related Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link 
              href="/viewer/news"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to All News</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Share Article
              </button>
              <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Print Article
              </button>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-orange-100 mb-6 max-w-md mx-auto">
              Get the latest handball news and updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-orange-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white"
              />
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}