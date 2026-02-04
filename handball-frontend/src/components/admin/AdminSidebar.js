'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  User, 
  Calendar, 
  BarChart3, 
  Image as ImageIcon, 
  Newspaper, 
  Flag, 
  Scale, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Target
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuSections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "Competition",
      items: [
        { name: "Tournaments", href: "/admin/tournaments", icon: Flag },
        { name: "Leagues", href: "/admin/leagues", icon: Trophy },
        { name: "Games", href: "/admin/games", icon: Calendar },
        { name: "Rankings", href: "/admin/rankings", icon: BarChart3 },
      ]
    },
    {
      title: "Teams & Players",
      items: [
        { name: "Teams", href: "/admin/teams", icon: Users },
        { name: "Players", href: "/admin/players", icon: User },
        { name: "Referees", href: "/admin/referees", icon: Scale },
      ]
    },
    {
      title: "Content",
      items: [
        { name: "News", href: "/admin/news", icon: Newspaper },
        { name: "Galleries", href: "/admin/galleries", icon: ImageIcon },
        { name: "Ads", href: "/admin/ads", icon: Target },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Users", href: "/admin/users", icon: Shield },
      ]
    }
  ];

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const SidebarContent = () => (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      className="h-full bg-gray-900 border-r border-gray-700/50 flex flex-col relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg"
          >
            <Image
              src="/img/logo.png"
              alt="Handball 263"
              width={24}
              height={24}
              className="rounded-lg"
            />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-400">Handball 263</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <AnimatePresence>
              {!collapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>
            
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                        active
                          ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-r-full"
                        />
                      )}
                      
                      <div className={`w-5 h-5 ${active ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Hover tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-gray-700/50 space-y-2">
        {/* Settings */}
        <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 group">
          <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <div className="pt-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 w-80 h-full lg:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}