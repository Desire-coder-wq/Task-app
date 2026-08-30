'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApiService } from '@/services/auth.api.service'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [devOtp, setDevOtp] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setDevOtp(null)

    try {
      const response = await authApiService.forgotPassword({ email: data.email })
      toast.success(response.message)
      if (response.devOtp) {
        setDevOtp(response.devOtp)
      }
      // Redirect to reset password page with email pre-filled as the token identifier
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`)
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP')
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
              <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
              <p className="text-gray-500 mt-2 text-sm">
                No worries, we'll send you reset instructions.
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

              {devOtp && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">Development OTP:</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{devOtp}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Use this OTP to reset your password.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
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
