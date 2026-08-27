'use client';

import { Search, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';

export function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name || 'User');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/auth/login');
  };

  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/settings')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>

          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ml-1">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}