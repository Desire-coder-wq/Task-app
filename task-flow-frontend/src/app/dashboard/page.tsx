'use client'

import { Layout } from '@/components/layout/Layout'
import { useTasks } from '@/hooks/useTasks'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Activity,
  FileText,
  Code,
  Briefcase
} from 'lucide-react'

export default function DashboardPage() {
  const { tasks } = useTasks()

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      const today = new Date()
      return dueDate < today && t.status !== 'COMPLETED'
    }).length,
  }

 
  const priorityStats = {
    high: tasks.filter(t => t.priority === 'HIGH').length,
    medium: tasks.filter(t => t.priority === 'MEDIUM').length,
    low: tasks.filter(t => t.priority === 'LOW').length,
  }


  const recentActivity = [
    {
      id: 1,
      user: 'Sarah Jenkins',
      action: 'updated Design Specs v2',
      time: '10 mins ago',
      type: 'update'
    },
    {
      id: 2,
      user: 'David Lee',
      action: 'commented on Client Presentation',
      comment: '"Looks good, but let\'s double check slide 4."',
      time: '1 hour ago',
      type: 'comment'
    },
    {
      id: 3,
      user: 'You',
      action: 'completed Weekly Review',
      time: 'Yesterday',
      type: 'complete'
    },
  ]

  // Upcoming deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Q3 Financial Report',
      description: 'Compile and review final statements for board distribution. Requires sign-off from Finance Dir.',
      department: 'Finance Dept',
      icon: FileText,
      dueDate: 'Oct 24'
    },
    {
      id: 2,
      title: 'Client Presentation Deck',
      description: 'Finalize slides for the new marketing campaign pitch to Acme Corp. Ensure brand guidelines are met.',
      department: 'Marketing',
      icon: Briefcase,
      dueDate: 'Oct 21'
    },
    {
      id: 3,
      title: 'API Integration Test',
      description: 'Run final unit tests on the new payment gateway integration.',
      department: 'Engineering',
      icon: Code,
      dueDate: 'Oct 19'
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-gray-500">Good morning, Alex. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Create Task
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp size={12} className="mr-1" />
                  12%
                </p>
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
                <p className="text-xs text-gray-500 mt-1">this week</p>
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
                <p className="text-xs text-gray-500 mt-1">—</p>
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
                <p className="text-xs text-red-600 mt-1">requires action</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

   
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Deadlines */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <span className="text-xs font-medium text-gray-500">{item.dueDate}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {item.department}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
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
                      {activity.comment && (
                        <p className="text-sm text-gray-500 mt-1 italic">{activity.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Task Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h2>
              <p className="text-sm text-gray-500 mb-4">By Priority Level</p>
              
              <div className="space-y-4">
                {/* High Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">High</span>
                    <span className="text-sm font-semibold text-gray-900">{priorityStats.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${tasks.length > 0 ? (priorityStats.high / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Medium Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Medium</span>
                    <span className="text-sm font-semibold text-gray-900">{priorityStats.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${tasks.length > 0 ? (priorityStats.medium / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Low Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Low</span>
                    <span className="text-sm font-semibold text-gray-900">{priorityStats.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${tasks.length > 0 ? (priorityStats.low / tasks.length) * 100 : 0}%` }}
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
  )
}