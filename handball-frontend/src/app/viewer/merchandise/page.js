import ViewerLayout from "@/components/ViewerLayout";
import { ShoppingBag, Shirt, Trophy, Star } from "lucide-react";

export default async function MerchandisePage() {
  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 shadow-2xl">
                <ShoppingBag className="text-white" size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Official Merchandise
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get ready to show your team spirit with our exclusive handball merchandise collection
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <Shirt className="text-orange-500 mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Team Jerseys</h3>
                <p className="text-gray-600 text-sm">Official team apparel and custom jerseys</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <Trophy className="text-yellow-500 mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Collectibles</h3>
                <p className="text-gray-600 text-sm">Limited edition items and memorabilia</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <Star className="text-amber-500 mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Accessories</h3>
                <p className="text-gray-600 text-sm">Gear and accessories for every fan</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="max-w-2xl mx-auto">
              {/* Animated Pulse Ring */}
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <ShoppingBag className="text-white" size={48} />
                </div>
                <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping"></div>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're working hard to bring you an amazing collection of official handball merchandise. 
                Get ready to support your favorite teams in style with jerseys, accessories, and exclusive items.
              </p>

              {/* Countdown/Progress Section */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-8 border border-orange-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Launching Soon
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  Our merchandise store is <span className="font-semibold text-orange-600">75% ready</span> and launching soon!
                </p>
              </div>

              {/* Notify Me Section */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Get Notified When We Launch
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
                  />
                  <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                    Notify Me
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Be the first to know when our merchandise becomes available
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-12">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">
                  Join Thousands of Excited Fans
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">2.5K+</div>
                    <div className="text-sm text-gray-600">Fans Waiting</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">50+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">15+</div>
                    <div className="text-sm text-gray-600">Teams</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">Coming</div>
                    <div className="text-sm text-gray-600">Soon 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Have questions about our upcoming merchandise?
            </p>
            <button className="bg-white text-orange-600 border border-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}