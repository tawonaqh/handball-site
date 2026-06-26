"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function AdminPageHeader({ 
  title, 
  description, 
  icon: Icon, 
  gradient = "from-orange-500 to-orange-600",
  action,
  breadcrumbs = []
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div className="min-w-0">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-3 overflow-x-auto">
            <Link href="/admin/dashboard" className="hover:text-orange-400 transition-colors flex items-center space-x-1">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-orange-400 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-300 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title & Description */}
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-gray-400 mt-1 text-sm sm:text-base">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </motion.div>
  );
}
