'use client';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}
