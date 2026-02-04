'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setIsChecking(false);
    }
  }, [router, pathname]);

  // Show loading while checking auth
  if (isChecking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
            <AdminSidebar 
              collapsed={false} 
              onToggle={() => setMobileMenuOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
