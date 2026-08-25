'use client'

import { Layout } from '@/components/layout/Layout'
import { Users, Mail, MoreVertical, UserPlus } from 'lucide-react'

const teamMembers = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Lead UX Designer',
    email: 'sarah@company.com',
    tasks: 12,
    avatar: 'SJ',
    color: 'bg-purple-500',
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Senior Developer',
    email: 'david@company.com',
    tasks: 8,
    avatar: 'DC',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    role: 'Product Manager',
    email: 'maria@company.com',
    tasks: 15,
    avatar: 'MR',
    color: 'bg-green-500',
  },
  {
    id: '4',
    name: 'Alex Rivers',
    role: 'Lead Architect',
    email: 'alex@company.com',
    tasks: 6,
    avatar: 'AR',
    color: 'bg-orange-500',
  },
]

export default function TeamPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-gray-500">Manage team members and view workload</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus size={20} />
            Add Member
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            ALL DEPARTMENTS
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            DESIGN
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            ENGINEERING
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            LEADERSHIP
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={16} />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Active Tasks</span>
                  <span className="font-semibold text-gray-900">{member.tasks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}