"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Bell, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/leagues", label: "Leagues" },
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
    { href: "/fixtures", label: "Fixtures" },
    { href: "/rankings", label: "Rankings" },
    { href: "/gallery", label: "Gallery" },
    { href: "/news", label: "News" },
    { href: "/merchandise", label: "Shop" },
  ];

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50' 
            : 'bg-gradient-to-r from-orange-500 to-yellow-400'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link 
              href="/home" 
              className="flex items-center gap-3 group"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                  <Image
                    src="/img/logo.png"
                    alt="Handball 263 Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    priority
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              </motion.div>
              
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  scrolled ? 'bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent' : 'text-white'
                }`}>
                  Handball 263
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  scrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  Zimbabwe Sports Hub
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? scrolled 
                        ? "text-orange-600 bg-orange-50 shadow-sm" 
                        : "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : scrolled
                        ? "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              
              {/* Search button */}
              <motion.button 
                className={`hidden md:flex p-3 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.div 
                className="relative hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className={`p-3 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}>
                  <Bell className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </motion.div>

              {/* User menu */}
              <motion.button 
                className={`hidden md:flex p-3 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* Mobile menu button */}
              <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div 
              className="lg:hidden fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-lg border-l border-gray-200/50 z-50 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-lg">
                      <Image
                        src="/img/logo.png"
                        alt="Handball 263 Logo"
                        width={24}
                        height={24}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        Menu
                      </h2>
                      <p className="text-xs text-gray-600">Navigation</p>
                    </div>
                  </div>
                  
                  <motion.button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg"
                            : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{item.label}</span>
                        {isActive(item.href) && (
                          <span className="ml-auto bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  <motion.button 
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs">3</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}