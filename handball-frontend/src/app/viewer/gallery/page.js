import ViewerLayout from "@/components/ViewerLayout";
import { fetcher } from "@/lib/api";

export default async function GalleryPage() {
  const items = await fetcher('galleries');

  // Group items by category if available
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // Calculate statistics
  const totalItems = items.length;
  const imageCount = items.filter(item => item.media_type === 'image').length;
  const videoCount = items.filter(item => item.media_type === 'video').length;

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Media Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Explore photos and videos from matches, events, and behind the scenes
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="font-semibold text-orange-600">{totalItems}</span>
                <span className="text-gray-600 ml-1">Total</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="font-semibold text-blue-600">{imageCount}</span>
                <span className="text-gray-600 ml-1">Photos</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="font-semibold text-red-600">{videoCount}</span>
                <span className="text-gray-600 ml-1">Videos</span>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Media Available</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Check back later for photos and videos from our events and matches.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <section key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {category}
                    </h2>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {categoryItems.length} items
                    </span>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {/* Media Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {item.media_type === 'image' ? (
                            <img
                              src={item.media_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <video
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              >
                                <source src={item.media_url} type="video/mp4" />
                              </video>
                              {/* Video Play Indicator */}
                              <div className="absolute top-3 right-3">
                                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                  VIDEO
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <h3 className="text-white font-semibold text-lg mb-2">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-gray-200 text-sm line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Info Bar (Always Visible) */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <span className="text-gray-500 text-sm">
                              {item.media_type === 'image' ? '📸' : '🎥'}
                            </span>
                          </div>
                          {item.created_at && (
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Footer Section */}
          {items.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  More Content Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  Stay tuned for more photos and videos from upcoming matches and events.
                </p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                    View More
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Follow Updates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewerLayout>
  );
}