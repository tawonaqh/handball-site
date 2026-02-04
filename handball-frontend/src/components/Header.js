"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Bell, User, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/viewer/home", label: "Home" },
    { href: "/viewer/leagues", label: "Leagues" },
    { href: "/viewer/teams", label: "Teams" },
    { href: "/viewer/players", label: "Players" },
    { href: "/viewer/fixtures", label: "Fixtures" },
    { href: "/viewer/rankings", label: "Rankings" },
    { href: "/viewer/gallery", label: "Gallery" },
    { href: "/viewer/merchandise", label: "Merch" },
  ];

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-xl' 
          : 'bg-gradient-to-r from-orange-500 to-yellow-400 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              href="/viewer/home" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
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
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold transition-colors ${scrolled ? 'text-gradient' : 'text-black'}`}>
                  Handball 263
                </h1>
                <p className={`text-xs transition-colors ${scrolled ? 'text-gray-600' : 'text-black/70'}`}>
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
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? scrolled 
                        ? "text-orange-600 bg-orange-50" 
                        : "bg-white text-orange-600 shadow-md"
                      : scrolled
                        ? "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        : "text-black hover:bg-white/30"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <button className={`hidden md:flex p-2 rounded-xl transition-colors ${
                scrolled 
                  ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                  : 'text-black hover:bg-white/30'
              }`}>
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative hidden md:block">
                <button className={`p-2 rounded-xl transition-colors ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-black hover:bg-white/30'
                }`}>
                  <Bell className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </div>

              {/* User menu */}
              <button className={`hidden md:flex p-2 rounded-xl transition-colors ${
                scrolled 
                  ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                  : 'text-black hover:bg-white/30'
              }`}>
                <User className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  scrolled 
                    ? 'text-gray-600 hover:text-orange-600 hover:bg-gray-50' 
                    : 'text-black hover:bg-white/30'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] glass border-l border-gray-200 p-6" onClick={(e) => e.stopPropagation()}>
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
                  <h2 className="font-bold text-gradient">Menu</h2>
                  <p className="text-xs text-gray-600">Navigation</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-orange-500 text-white shadow-lg"
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
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs">3</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}