"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";

export default function AdminHeader({ onMenuToggle, sidebarCollapsed }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add dark mode toggle logic here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-card border-b border-border/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gradient">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your handball league
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search button for mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hidden sm:flex"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Badge 
                variant="error" 
                size="sm" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-border/50">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.email || 'admin@example.com'}
                </p>
              </div>
              
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}