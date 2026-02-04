"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTrophy, FaArrowRight, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import { IoStatsChart, IoTrendingUp, IoFlash } from "react-icons/io5";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const slides = [
    {
      src: "/img/hero1.jpg",
      title: "Championship Glory",
      subtitle: "Where champions rise and legends are born",
      accent: "Experience the ultimate handball action",
      color: "from-orange-600 to-red-600"
    },
    {
      src: "/img/hero2.jpg", 
      title: "Team Excellence",
      subtitle: "Unity, passion, and determination combined",
      accent: "Witness the power of teamwork",
      color: "from-blue-600 to-purple-600"
    },
    {
      src: "/img/hero3.jpg",
      title: "Victory Celebration",
      subtitle: "Every match tells a story of triumph",
      accent: "Celebrate the spirit of handball",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "25+", label: "Active Leagues", icon: FaTrophy, delay: 0.2 },
    { number: "150+", label: "Teams", icon: FaUsers, delay: 0.4 },
    { number: "500+", label: "Players", icon: FaStar, delay: 0.6 },
    { number: "1000+", label: "Matches", icon: FaCalendarAlt, delay: 0.8 }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          speed={1500}
          autoplay={{ 
            delay: 6000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'hero-bullet',
            bulletActiveClass: 'hero-bullet-active'
          }}
          navigation={{
            nextEl: '.hero-next',
            prevEl: '.hero-prev'
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="w-full h-full hero-swiper"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
                
                {/* Dynamic gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}/70 via-black/50 to-black/70`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="hero-prev absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
          <FaArrowRight className="rotate-180 group-hover:scale-125 transition-transform text-sm md:text-base" />
        </button>
        <button className="hero-next absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
          <FaArrowRight className="group-hover:scale-125 transition-transform text-sm md:text-base" />
        </button>
      </div>

      {/* Main Content Container - Fixed positioning and sizing */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-400/30 text-orange-200 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl mb-6 md:mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <IoFlash className="text-yellow-400" size={16} />
              </motion.div>
              <span className="font-bold text-xs md:text-sm lg:text-base">Zimbabwe's Premier Handball Hub</span>
            </motion.div>
            
            {/* Main Heading - Responsive sizing */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 md:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block mb-2">Welcome to</span>
              <span className="block text-gradient bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Handball 263
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Experience the ultimate handball destination with live tournaments, comprehensive rankings, 
              detailed player statistics, and breaking news from across Zimbabwe.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 md:mb-8"
            >
              <Link
                href="/viewer/leagues"
                className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-105 flex items-center space-x-3 overflow-hidden w-full sm:w-auto justify-center max-w-xs"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <FaTrophy className="relative z-10 group-hover:rotate-12 transition-transform duration-300" size={18} />
                <span className="relative z-10">Explore Tournaments</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={14} />
              </Link>
              
              <Link
                href="/viewer/rankings"
                className="group glass border-2 border-white/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 hover:border-white/60 transition-all duration-500 flex items-center space-x-3 backdrop-blur-md w-full sm:w-auto justify-center max-w-xs"
              >
                <IoStatsChart className="group-hover:scale-125 transition-transform duration-300" size={18} />
                <span>View Rankings</span>
                <IoTrendingUp className="group-hover:translate-x-1 transition-transform duration-300" size={14} />
              </Link>
            </motion.div>

            {/* Stats Grid - Improved responsive layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30, scale: isLoaded ? 1 : 0.8 }}
                  transition={{ delay: stat.delay, duration: 0.6 }}
                  className="text-center group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="text-yellow-400 group-hover:text-yellow-300" size={16} />
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-black text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-30 text-center"
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          y: [0, 10, 0]
        }}
        transition={{ 
          opacity: { delay: 1.5, duration: 0.8 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-6 h-10 md:w-8 md:h-12 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
          <motion.div 
            className="w-1.5 h-2.5 md:w-2 md:h-3 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mt-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-white/80 text-xs md:text-sm mt-2 font-medium">Scroll to explore</p>
      </motion.div>
    </div>
  );
}
