'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Team Member');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name || 'User');
      setUserRole(parsed.role || 'Team Member');
    }
  }, []);

  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 text-gray-700 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="TaskPilot Logo"
              width={48}
              height={48}
              className="rounded-lg w-12 h-12 object-contain shrink-0"
              priority
            />
            <span className="text-xl font-bold text-blue-600">TaskPilot</span>
          </div>
        )}
        {isCollapsed && (
          <Image
            src="/images/logo.png"
            alt="TaskPilot Logo"
            width={40}
            height={40}
            className="rounded-lg w-10 h-10 object-contain shrink-0"
            priority
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-500"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200">
        <div className="p-4 pb-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userRole}</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mx-auto">
              {initials}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 mx-4 mb-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center mx-2' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}