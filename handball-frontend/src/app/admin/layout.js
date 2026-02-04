'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply dark theme to admin
    document.documentElement.classList.add('dark');
    
    // Don't check auth on login page (handled by middleware)
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Quick client-side check (middleware handles the real auth)
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
      router.push('/admin/login');
    } else {
      setIsChecking(false);
    }

    return () => {
      // Clean up dark theme when leaving admin
      document.documentElement.classList.remove('dark');
    };
  }, [router, pathname]);

  // Show loading while checking auth
  if (isChecking && pathname !== '/admin/login') {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <AdminHeader 
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content with dark theme */}
        <main className="flex-1 p-6 overflow-auto bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}