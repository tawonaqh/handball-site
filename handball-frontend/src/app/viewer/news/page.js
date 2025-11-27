import { fetcher } from "@/lib/api";
import NewsCard from '../../../components/NewsCard';
import ViewerLayout from "@/components/ViewerLayout";
import { Calendar, Newspaper, TrendingUp } from "lucide-react";

export default async function NewsPage() {
  const news = await fetcher('news');

  // Sort news by date (newest first)
  const sortedNews = [...news].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Calculate statistics
  const totalArticles = news.length;
  const recentArticles = news.filter(item => {
    const articleDate = new Date(item.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return articleDate > weekAgo;
  }).length;

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 shadow-2xl">
                <Newspaper className="text-white" size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Latest News
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Stay updated with the latest handball news, match updates, and tournament announcements
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {totalArticles}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Articles</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {recentArticles}
                </div>
                <div className="text-sm text-gray-600 font-medium">This Week</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {sortedNews.length > 0 ? new Date(sortedNews[0].created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Latest Update</div>
              </div>
            </div>
          </div>

          {/* Featured News Section */}
          {sortedNews.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="mr-3 text-orange-500" size={28} />
                  Featured Stories
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Updated daily</span>
                </div>
              </div>
              
              {/* Featured News Card (Latest Article) */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="p-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar size={16} />
                    <span>{new Date(sortedNews[0].created_at).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                      LATEST
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {sortedNews[0].title}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {sortedNews[0].content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By Author {sortedNews[0].author_id}
                    </span>
                    <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200">
                      Read Full Story
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All News Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All News Articles
              </h2>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                {sortedNews.length} {sortedNews.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            {sortedNews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No News Available</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Check back later for the latest news and updates from the handball community.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedNews.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`transform transition-all duration-300 hover:scale-[1.02] ${
                      index === 0 ? 'opacity-0 h-0' : '' // Hide first item since it's featured above
                    }`}
                  >
                    <NewsCard news={item} />
                  </div>
                )).filter((_, index) => index > 0)} {/* Skip first item since it's featured */}
              </div>
            )}
          </section>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Never Miss an Update</h3>
            <p className="text-orange-100 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter and get the latest handball news delivered directly to your inbox.
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