'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="TaskPilot"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold">TaskPilot</span>
          </div>
        )}
        {isCollapsed && (
          <Image
            src="/images/logo.png"
            alt="TaskPilot"
            width={32}
            height={32}
            className="rounded-lg mx-auto"
            priority
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-400">Team Member</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
            <Users size={16} />
          </div>
        )}
      </div>
    </aside>
  )
}
