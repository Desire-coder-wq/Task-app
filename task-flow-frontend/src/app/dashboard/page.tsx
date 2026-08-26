'use client';

import { Layout } from '@/components/layout/Layout';
import { useDashboardStats } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ListTodo,
  FileText,
  Code,
  Briefcase,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { stats, isLoading } = useDashboardStats();
  const { tasks } = useTasks();

  // Filter tasks for upcoming deadlines (not completed)
  const upcomingTasks = tasks
    .filter(task => task.status !== 'COMPLETED')
    .slice(0, 3);

  // Filter tasks for recent activity (completed or updated)
  const recentTasks = tasks
    .slice(0, 3)
    .map(task => ({
      id: task.id,
      user: task.assignedUser?.name || 'Unknown',
      action: task.status === 'COMPLETED' ? 'completed task' : `updated "${task.title}"`,
      comment: task.description?.substring(0, 60) + (task.description?.length > 60 ? '...' : ''),
      time: new Date(task.updatedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: task.status === 'COMPLETED' ? 'complete' : 'update'
    }));

  // Get icon based on task title or default
  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('report') || lower.includes('financial')) return FileText;
    if (lower.includes('presentation') || lower.includes('pitch')) return Briefcase;
    if (lower.includes('api') || lower.includes('integration') || lower.includes('code')) return Code;
    return FileText;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-gray-500">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => router.push('/tasks')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">All tasks</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ListTodo className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">Finished tasks</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-gray-500 mt-1">Active tasks</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-xs text-red-600 mt-1">Requires action</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Deadlines */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {upcomingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
                ) : (
                  upcomingTasks.map((task) => {
                    const Icon = getIcon(task.title);
                    return (
                      <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Icon size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span className="text-xs font-medium text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'TODO' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.status}
                            </span>
                            {task.assignedUser && (
                              <span className="text-xs text-gray-500">
                                {task.assignedUser.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  recentTasks.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'update' ? 'bg-blue-500' :
                        activity.type === 'comment' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-gray-900">{activity.user}</span>
                          <span className="text-gray-600"> {activity.action}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{activity.comment}</p>
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
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h2>
              <p className="text-sm text-gray-500 mb-4">By Priority Level</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">High</span>
                    <span className="text-sm font-semibold text-gray-900">{stats.priorityStats.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.priorityStats.high / stats.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Medium</span>
                    <span className="text-sm font-semibold text-gray-900">{stats.priorityStats.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.priorityStats.medium / stats.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Low</span>
                    <span className="text-sm font-semibold text-gray-900">{stats.priorityStats.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.priorityStats.low / stats.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600">In Progress</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.todo}</p>
                    <p className="text-xs text-gray-600">To Do</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                    <p className="text-xs text-gray-600">Overdue</p>
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
