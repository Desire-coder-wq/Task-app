'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Users, BarChart3, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { invitationService } from '@/services/InvitationService'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [isInvitation, setIsInvitation] = useState(false)

  useEffect(() => {
    if (token) {
      setIsInvitation(true)
    }
  }, [token])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const passwordRequirements = useMemo(() => {
    return [
      { label: 'At least 6 characters', met: passwordValue.length >= 6 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(passwordValue) },
      { label: 'One lowercase letter', met: /[a-z]/.test(passwordValue) },
      { label: 'One number', met: /[0-9]/.test(passwordValue) },
    ]
  }, [passwordValue])

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreed) {
      toast.error('Please agree to the Terms and Privacy Policy')
      return
    }

    setIsLoading(true)

    try {
      if (isInvitation && token) {
        // Accept invitation and create account
        const response = await invitationService.acceptInvitation(token, data.password, data.name)
        
        toast.success('Account created successfully!')
        
        // Auto-login after success
        setTimeout(async () => {
          try {
            const loginResponse = await authService.login({
              email: response.user?.email || data.email,
              password: data.password,
            })
            
            if (loginResponse.token) {
              localStorage.setItem('token', loginResponse.token)
              localStorage.setItem('user', JSON.stringify(loginResponse.user))
              window.dispatchEvent(new Event('user-login'))
              router.push('/dashboard')
            } else {
              router.push('/auth/login')
            }
          } catch (error) {
            router.push('/auth/login')
          }
        }, 1500)
      } else {
        // Normal registration
        await authService.register({
          name: data.name,
          email: data.email,
          password: data.password,
        })
        
        toast.success('Account created successfully!')
        router.push('/auth/login')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed')
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
              width={56}
              height={56}
              className="mb-3"
              priority
            />
            <span className="text-2xl font-bold text-gray-900">TaskPilot</span>
          </div>

          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {isInvitation ? 'Accept Invitation' : 'Create your account'}
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                {isInvitation 
                  ? 'Create your account to join the team.' 
                  : 'Join thousands of teams managing projects efficiently.'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="register-name" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="register-name"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="block text-xs font-semibold tracking-wide text-gray-700 mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('password')}
                    onChange={(e) => {
                      register('password').onChange(e)
                      setPasswordValue(e.target.value)
                    }}
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

                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <CheckCircle2 className="text-green-600" size={16} />
                      ) : (
                        <XCircle className="text-gray-400" size={16} />
                      )}
                      <span
                        className={`text-xs ${
                          req.met ? 'text-green-700 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating account...' : isInvitation ? 'Accept Invitation' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            © 2026 TaskPilot . All rights reserved.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <Image
          src="/images/screen.png"
          alt="TaskPilot workspace"
          fill
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-pink-200/30 to-orange-100/30 backdrop-blur-[2px]" />

        <div className="relative z-10 w-full max-w-sm px-8 space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-lg flex gap-4 items-start">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Team Collaboration</p>
              <p className="text-sm text-gray-500 mt-1">
                Organize Your Team: Collaborate seamlessly with unified workspaces.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg flex gap-4 items-start">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <BarChart3 className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Progress Tracking</p>
              <p className="text-sm text-gray-500 mt-1">
                Track Efficiently: Visualize progress with intelligent dashboards.
              </p>
            </div>
          </div>

          <p className="text-center text-xs tracking-wider text-gray-600 font-medium pt-2">
            EMPOWERING OVER 10,000 TEAMS
          </p>
        </div>
      </div>
    </div>
  )
}