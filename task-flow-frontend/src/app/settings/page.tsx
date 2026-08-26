'use client'

import { Layout } from '@/components/layout/Layout'
import { User, Bell, Lock, Palette, Globe, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usersService } from '@/services/users.service'
import { User as AppUser } from '@/types/task'

const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      reset({
        name: parsed.name || '',
        email: parsed.email || '',
        role: parsed.role || '',
      })
    }
  }, [reset])

  const onSubmit = async (data: SettingsFormData) => {
    if (!user?.id) return
    setIsLoading(true)

    try {
      const updated = await usersService.updateUser(user.id, {
        name: data.name,
        email: data.email,
        role: data.role,
      })
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      toast.success('Settings saved successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <User size={18} />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={18} />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Lock size={18} />
              Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Palette size={18} />
              Appearance
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Globe size={18} />
              Preferences
            </button>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    {...register('role')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
