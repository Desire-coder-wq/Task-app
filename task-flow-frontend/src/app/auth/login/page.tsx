'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Call your backend API
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                TP
              </div>
              <span className="text-2xl font-bold text-gray-900">TaskPilot</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your TaskPilot account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me for 30 days</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="text-white text-center">
          <h2 className="text-4xl font-bold mb-4">TaskPilot</h2>
          <p className="text-xl text-blue-100">Manage your tasks efficiently</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-blue-100">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm text-blue-100">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}