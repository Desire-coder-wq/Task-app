'use client';

import { Layout } from '@/components/layout/Layout';
import { useDashboardStats } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListChecks,
  FileText,
  Code2,
  Briefcase,
  ArrowUp,
  Plus,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { stats, isLoading } = useDashboardStats();
  const { tasks } = useTasks();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name || 'User');
    }
  }, []);

  const upcomingTasks = tasks
    .filter((task) => task.status !== 'COMPLETED')
    .slice(0, 3);

  const recentTasks = tasks.slice(0, 3).map((task) => ({
    id: task.id,
    user: task.assignedUser?.name || 'Unknown',
    action: task.status === 'COMPLETED' ? 'completed' : 'updated',
    title: task.title,
    comment:
      task.description?.substring(0, 60) +
      (task.description && task.description.length > 60 ? '...' : ''),
    time: new Date(task.updatedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('report') || lower.includes('financial')) return FileText;
    if (lower.includes('presentation') || lower.includes('pitch')) return Briefcase;
    if (lower.includes('api') || lower.includes('integration') || lower.includes('code'))
      return Code2;
    return FileText;
  };

  const getDueLabel = (dueDate: string | Date) => {
    const due = new Date(dueDate);
    const now = new Date();
    const isSameDay = due.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = due.toDateString() === tomorrow.toDateString();

    const time = due.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    if (isSameDay) return { label: `Today, ${time}`, className: 'bg-orange-100 text-orange-700' };
    if (isTomorrow) return { label: `Tomorrow, ${time}`, className: 'bg-blue-100 text-blue-700' };
    return {
      label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      className: 'bg-gray-100 text-gray-600',
    };
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const maxPriority = Math.max(
    stats.priorityStats.high,
    stats.priorityStats.medium,
    stats.priorityStats.low,
    1
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-gray-500 mt-0.5">
              Good morning, {userName}. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <button
            onClick={() => router.push('/tasks')}
            className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500">TOTAL TASKS</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                    <ArrowUp size={12} />
                    12%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <ListChecks className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500">COMPLETED</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                <p className="text-xs text-gray-400 mt-0.5">this week</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500">IN PROGRESS</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-red-500">OVERDUE</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
                <p className="text-xs text-red-500 mt-0.5">requires action</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                <button
                  onClick={() => router.push('/tasks')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-1">
                {upcomingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
                ) : (
                  upcomingTasks.map((task) => {
                    const Icon = getIcon(task.title);
                    const due = getDueLabel(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${due.className}`}
                            >
                              {due.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-semibold text-gray-600">
                              {getInitials(task.assignedUser?.name || 'U')}
                            </div>
                            <span className="text-xs text-gray-500">
                              {task.assignedUser?.name || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  recentTasks.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-3 border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-semibold text-blue-700 shrink-0">
                        {getInitials(activity.user)}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-gray-900">{activity.user}</span>
                          <span className="text-gray-600"> {activity.action} </span>
                          <span className="font-medium text-gray-900">
                            &quot;{activity.title}&quot;
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{activity.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Task Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold">Task Distribution</h2>
              <p className="text-sm text-blue-100 mb-6">By Priority Level</p>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-blue-50">High</span>
                    <span className="text-sm font-semibold">{stats.priorityStats.high}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div
                      className="bg-red-400 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stats.priorityStats.high / maxPriority) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-blue-50">Medium</span>
                    <span className="text-sm font-semibold">{stats.priorityStats.medium}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div
                      className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stats.priorityStats.medium / maxPriority) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-blue-50">Low</span>
                    <span className="text-sm font-semibold">{stats.priorityStats.low}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div
                      className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stats.priorityStats.low / maxPriority) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}