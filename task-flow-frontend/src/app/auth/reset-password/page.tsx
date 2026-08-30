'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApiService } from '@/services/auth.api.service'

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(1, 'OTP is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setValue('email', emailParam)
    }
  }, [setValue])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)

    try {
      await authApiService.resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password,
      })

      toast.success('Password reset successfully! Please login with your new password.')
      router.push('/auth/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/logo.png"
              alt="TaskPilot"
              width={96}
              height={96}
              className="mb-3"
              priority
            />
            <span className="text-2xl font-bold text-gray-900">TaskPilot</span>
          </div>

          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
              <p className="text-gray-500 mt-2 text-sm">
                Enter the OTP sent to your email and choose a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
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
                <label htmlFor="otp" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  OTP CODE
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('otp')}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              <Link href="/auth/login" className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            © 2026 TaskPilot Productivity Suite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
