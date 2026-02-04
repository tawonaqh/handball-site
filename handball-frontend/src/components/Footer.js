"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Trophy, Users, Calendar, Star, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/viewer/home" },
    { label: "Leagues", href: "/viewer/leagues" },
    { label: "Teams", href: "/viewer/teams" },
    { label: "Players", href: "/viewer/players" },
    { label: "Fixtures", href: "/viewer/fixtures" },
    { label: "Rankings", href: "/viewer/rankings" },
  ];

  const resources = [
    { label: "Gallery", href: "/viewer/gallery" },
    { label: "News", href: "/viewer/news" },
    { label: "Merchandise", href: "/viewer/merchandise" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com/handball263", label: "Facebook", color: "hover:text-blue-600" },
    { icon: FaTwitter, href: "https://twitter.com/handball263", label: "Twitter", color: "hover:text-sky-500" },
    { icon: FaInstagram, href: "https://instagram.com/handball263", label: "Instagram", color: "hover:text-pink-600" },
    { icon: FaYoutube, href: "https://youtube.com/handball263", label: "YouTube", color: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
            {/* Brand section */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/viewer/home" className="inline-flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-300">
                    <Image
                      src="/img/logo.png"
                      alt="Handball 263 Logo"
                      width={40}
                      height={40}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    Handball 263
                  </h3>
                  <p className="text-gray-300 text-sm">Zimbabwe Sports Hub</p>
                </div>
              </Link>

              <p className="text-gray-300 leading-relaxed">
                The premier destination for handball in Zimbabwe. Follow tournaments, track your favorite teams, and stay updated with the latest news and highlights.
              </p>

              {/* Contact info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaEnvelope className="w-4 h-4 text-orange-400" />
                  <span>info@handball263.co.zw</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaPhone className="w-4 h-4 text-orange-400" />
                  <span>+263 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaMapMarkerAlt className="w-4 h-4 text-orange-400" />
                  <span>Harare, Zimbabwe</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-orange-400" />
                Quick Links
              </h4>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center text-gray-300 hover:text-orange-400 transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Resources
              </h4>
              <div className="space-y-3">
                {resources.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get the latest handball news, match results, and tournament updates delivered to your inbox.
              </p>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <FaEnvelope className="w-4 h-4" />
                  <span>Subscribe Now</span>
                </button>
              </form>
              
              <p className="text-xs text-gray-400">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50+</div>
                  <div className="text-xs text-gray-400">Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">200+</div>
                  <div className="text-xs text-gray-400">Players</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <p>&copy; {currentYear} Handball 263. All rights reserved.</p>
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
                  <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Proudly developed by</span>
                <span className="font-bold text-gradient bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  CodeMafia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
