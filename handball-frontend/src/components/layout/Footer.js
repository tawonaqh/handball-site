import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { name: "Home", href: "/home" },
      { name: "Leagues", href: "/leagues" },
      { name: "Teams", href: "/teams" },
      { name: "Players", href: "/players" },
    ],
    "Competition": [
      { name: "Fixtures", href: "/fixtures" },
      { name: "Rankings", href: "/rankings" },
      { name: "Tournaments", href: "/tournaments" },
      { name: "Results", href: "/results" },
    ],
    "Media": [
      { name: "News", href: "/news" },
      { name: "Gallery", href: "/gallery" },
      { name: "Videos", href: "/videos" },
      { name: "Press", href: "/press" },
    ],
    "Support": [
      { name: "Contact Us", href: "/contact" },
      { name: "About", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: FaFacebook, href: "#", color: "hover:text-blue-500" },
    { name: "Twitter", icon: FaTwitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: FaInstagram, href: "#", color: "hover:text-pink-500" },
    { name: "YouTube", icon: FaYoutube, href: "#", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Link href="/home" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src="/img/logo.png"
                      alt="Handball 263 Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Handball 263
                  </h3>
                  <p className="text-gray-400 text-sm">Zimbabwe Sports Hub</p>
                </div>
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mb-6 leading-relaxed"
            >
              Zimbabwe's premier handball destination. Follow live tournaments, track team rankings, 
              discover player statistics, and stay updated with the latest handball news.
            </motion.p>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="w-4 h-4 text-orange-400" />
                <span>info@handball263.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaPhone className="w-4 h-4 text-orange-400" />
                <span>+263 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaMapMarkerAlt className="w-4 h-4 text-orange-400" />
                <span>Harare, Zimbabwe</span>
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm"
            >
              © {currentYear} Handball 263. All rights reserved. Developed by <Link className="text-red-400 hover:underline" href="https://tawona.vercel.app">Code Mafia</Link>.
            </motion.p>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-gray-600`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}