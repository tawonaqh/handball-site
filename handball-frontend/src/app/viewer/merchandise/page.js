"use client";

import ViewerLayout from "@/components/ViewerLayout";
import { motion } from "framer-motion";
import { ShoppingBag, Shirt, Trophy, Star, Bell, Gift, Zap, Heart, Mail, Calendar, Users, Package } from "lucide-react";
import { useState } from "react";

export default function MerchandisePage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // Here you would typically send the email to your backend
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <ViewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 py-20 overflow-hidden -mt-20 pt-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full mb-6">
                <ShoppingBag className="text-yellow-300" size={20} />
                <span className="font-semibold">Official Store</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Show Your <span className="text-yellow-300">Team Spirit</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-orange-100 max-w-3xl mx-auto mb-8">
                Get ready for an exclusive collection of official handball merchandise, team jerseys, and collectibles that celebrate the sport we love.
              </p>

              {/* Coming Soon Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center space-x-2 bg-yellow-400 text-orange-900 px-6 py-3 rounded-full font-bold text-lg shadow-2xl"
              >
                <Zap size={20} />
                <span>Launching Soon</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Feature Highlights */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Coming</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the amazing products we're preparing for handball fans across Zimbabwe
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shirt className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Jerseys</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Official team apparel, custom jerseys, and training gear for players and fans alike.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Home & Away Kits</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Custom Names & Numbers</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Training Equipment</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Collectibles</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Limited edition items, signed memorabilia, and exclusive collectibles from tournaments.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Signed Balls & Photos</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>Championship Replicas</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Limited Editions</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Star className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Fan Gear</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Accessories, fan gear, and lifestyle products to show your handball pride everywhere.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Caps & Scarves</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Bags & Bottles</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Phone Cases & More</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Main Coming Soon Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-center text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                {/* Animated Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block mb-8"
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Package className="text-white" size={48} />
                  </div>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  Something Amazing is Coming
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  We're crafting an incredible shopping experience with exclusive handball merchandise. 
                  From official team jerseys to unique collectibles, get ready to gear up in style!
                </p>

                {/* Progress Bar */}
                <div className="bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-full rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <p className="text-gray-400 mb-8">
                  <span className="font-bold text-yellow-400">85% Complete</span> - Launching Very Soon!
                </p>

                {/* Email Signup */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
                    <Bell className="text-yellow-400" size={24} />
                    <span>Be the First to Know</span>
                  </h3>
                  
                  {!isSubscribed ? (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300 backdrop-blur-sm"
                      />
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Notify Me
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold">
                        <Heart size={20} />
                        <span>Thanks! You're on the list!</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <p className="text-sm text-gray-400 mt-4">
                    Join thousands of fans waiting for our exclusive merchandise launch
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-3xl font-black text-orange-600 mb-2">3.2K+</div>
                  <div className="text-sm text-gray-600 font-medium">Fans Waiting</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-3xl font-black text-yellow-600 mb-2">75+</div>
                  <div className="text-sm text-gray-600 font-medium">Products Ready</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl font-black text-blue-600 mb-2">20+</div>
                  <div className="text-sm text-gray-600 font-medium">Team Designs</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl font-black text-purple-600 mb-2">2024</div>
                  <div className="text-sm text-gray-600 font-medium">Launch Year</div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Preview Gallery */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Sneak Peek</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get a glimpse of what's coming to our merchandise store
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item * 0.1 }}
                  className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <Gift className="text-gray-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors" size={32} />
                    <p className="text-gray-500 text-sm font-medium">Coming Soon</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Questions About Our Merchandise?</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Have specific requests or want to know more about our upcoming products? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-2">
                <Mail size={20} />
                <span>Contact Support</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200 flex items-center justify-center space-x-2">
                <Users size={20} />
                <span>Join Community</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ViewerLayout>
  );
}