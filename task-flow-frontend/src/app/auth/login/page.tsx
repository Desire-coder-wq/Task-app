'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService, type LoginRequest } from '@/services/auth.service'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      })

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        toast.error('Cannot connect to server. Please check if backend is running on http://localhost:3002')
      } else {
        toast.error(error.message || 'Invalid credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo + brand, centered */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/logo.png"
              alt="TaskPilot"
              width={64}
              height={64}
              className="mb-3"
              priority
            />
            <span className="text-3xl font-bold text-gray-900">TaskPilot</span>
          </div>

          {/* Card */}
          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Sign in to your TaskPilot account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="login-email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-xs font-semibold tracking-wide text-gray-700">
                    PASSWORD
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register('remember')}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one now
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            © 2026 TaskPilot Productivity Suite. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: image */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/images/screen.png"
          alt="TaskPilot workspace"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
