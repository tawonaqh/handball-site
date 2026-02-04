"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  Users,
  User,
  Calendar,
  FileText,
  Image,
  Shield,
  Flag,
  Scale,
  Target,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: User },
    ],
  },
  {
    title: "Competition",
    items: [
      { href: "/admin/tournaments", label: "Tournaments", icon: Flag },
      { href: "/admin/leagues", label: "Leagues", icon: Trophy },
      { href: "/admin/games", label: "Games", icon: Calendar },
      { href: "/admin/rankings", label: "Rankings", icon: BarChart3 },
    ],
  },
  {
    title: "Teams & Players",
    items: [
      { href: "/admin/teams", label: "Teams", icon: Users },
      { href: "/admin/players", label: "Players", icon: User },
      { href: "/admin/referees", label: "Referees", icon: Scale },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/news", label: "News", icon: FileText },
      { href: "/admin/galleries", label: "Galleries", icon: Image },
      { href: "/admin/ads", label: "Advertisements", icon: Target },
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/admin/login');
    }
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card border-r border-border/50 shadow-lg flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Admin Panel</h2>
                  <p className="text-xs text-muted-foreground">Management</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.title} className="px-4">
              <AnimatePresence>
                {!collapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
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
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <Link href={item.href}>
                        <div
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                            active
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                          
                          <AnimatePresence>
                            {!collapsed && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-medium whitespace-nowrap"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          
                          {active && !collapsed && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? "px-0" : "justify-start"}`}
        >
          <Settings className="w-5 h-5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? "px-0" : "justify-start"}`}
        >
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Badge variant="error" size="sm" className="ml-auto">
              3
            </Badge>
          )}
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleLogout}
          className={`w-full ${collapsed ? "px-0" : "justify-start"}`}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}