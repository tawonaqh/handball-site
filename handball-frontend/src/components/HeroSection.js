"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from "swiper/modules";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaTrophy, FaPlay, FaArrowRight, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import { IoStatsChart, IoTrendingUp, IoFlash } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/parallax";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* ANIMATED BACKGROUND PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* BACKGROUND CAROUSEL WITH PARALLAX */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y }}
      >
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          parallax={true}
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
          modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax]}
          className="w-full h-full hero-swiper"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <div data-swiper-parallax="-300">
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    className="object-cover scale-110"
                    priority={idx === 0}
                  />
                </div>
                
                {/* Dynamic gradient overlay based on slide */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}/60 via-black/40 to-black/60`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Animated geometric shapes */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-white/20 rotate-45"
                    animate={{ rotate: [45, 405] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-yellow-400/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>
                
                {/* Slide-specific content overlay */}
                <div className="absolute bottom-12 left-8 right-8 text-white z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: currentSlide === idx ? 1 : 0, x: currentSlide === idx ? 0 : -50 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-md"
                  >
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                        {slide.accent}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">{slide.title}</h3>
                    <p className="text-lg text-yellow-200 font-medium drop-shadow">{slide.subtitle}</p>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced Custom Navigation */}
        <button className="hero-prev absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
          <FaArrowRight className="rotate-180 group-hover:scale-125 transition-transform" />
        </button>
        <button className="hero-next absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
          <FaArrowRight className="group-hover:scale-125 transition-transform" />
        </button>
      </motion.div>

      {/* MAIN CONTENT WITH ENHANCED ANIMATIONS */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Enhanced Main Heading */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-400/30 text-orange-200 px-8 py-4 rounded-full mb-8 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <IoFlash className="text-yellow-400" size={24} />
              </motion.div>
              <span className="font-bold text-lg">Zimbabwe's Premier Handball Hub</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-8xl font-black leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block mb-4">Welcome to</span>
              <span className="block relative">
                <span className="text-gradient bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent animate-pulse">
                  Handball 263
                </span>
                {/* Glowing effect */}
                <span className="absolute inset-0 text-gradient bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Handball 263
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-3xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Experience the ultimate handball destination with live tournaments, comprehensive rankings, 
              detailed player statistics, and breaking news from across Zimbabwe.
            </motion.p>
          </div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/viewer/leagues"
              className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-110 flex items-center space-x-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <FaTrophy className="relative z-10 group-hover:rotate-12 transition-transform duration-300" size={24} />
              <span className="relative z-10">Explore Tournaments</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </Link>
            
            <Link
              href="/viewer/rankings"
              className="group glass border-2 border-white/40 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 hover:border-white/60 transition-all duration-500 flex items-center space-x-4 backdrop-blur-md"
            >
              <IoStatsChart className="group-hover:scale-125 transition-transform duration-300" size={24} />
              <span>View Rankings</span>
              <IoTrendingUp className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
          </motion.div>

          {/* Enhanced Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30, scale: isLoaded ? 1 : 0.8 }}
                transition={{ delay: stat.delay, duration: 0.6 }}
                className="text-center group"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="text-yellow-400 group-hover:text-yellow-300" size={24} />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-300 font-medium group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator - Repositioned to avoid button overlap */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-8 h-14 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
          <motion.div 
            className="w-2 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mt-3"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-white/80 text-sm mt-3 font-medium">Scroll to explore</p>
      </motion.div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
