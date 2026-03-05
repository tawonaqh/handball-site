"use client";

import { motion } from "framer-motion";
import { Target, Users, Trophy, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To promote and develop handball across Zimbabwe, creating opportunities for athletes at all levels."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong handball community that supports players, coaches, and fans nationwide."
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Striving for excellence in competition, training, and athlete development programs."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by our love for handball and commitment to growing the sport in Zimbabwe."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Handball 263
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Zimbabwe's premier handball organization dedicated to excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Handball 263 was founded with a vision to transform handball in Zimbabwe. 
                  What started as a small initiative has grown into the nation&apos;s leading handball 
                  organization, bringing together players, coaches, and fans from across the country.
                </p>
                <p>
                  Today, we manage multiple leagues, organize national tournaments, and provide 
                  comprehensive coverage of all handball activities in Zimbabwe. Our platform serves 
                  as the central hub for everything handball - from live match updates to player 
                  statistics and news.
                </p>
                <p>
                  We&apos;re committed to developing the sport at all levels, from grassroots programs 
                  to elite competition, ensuring that handball continues to grow and thrive in Zimbabwe.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
