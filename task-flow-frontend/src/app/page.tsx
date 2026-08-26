'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Users, TrendingUp, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-slate-50">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="TaskPilot" width={32} height={32} />
          <span className="text-xl font-bold text-blue-600">TaskPilot</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-50 px-8 pt-16 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mb-6" />
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Master Your Workflow
              <br />
              with <span className="text-blue-600">TaskPilot</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-md">
              The all-in-one task management solution for high-performing teams.
              Organize projects, track progress, and accelerate productivity.
            </p>
            <Link
              href="/auth/register"
              className="inline-block mt-8 px-6 py-3.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started for Free
            </Link>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/screen.png"
              alt="TaskPilot in action"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-indigo-50/60 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">
            Everything you need to ship faster
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center mb-5">
                <Users className="text-blue-600" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Team Collaboration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Organized workspaces and real-time updates keep everyone on the same
                page.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center mb-5">
                <TrendingUp className="text-blue-600" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Intelligent dashboards and visual milestones provide absolute clarity
                on project status.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center mb-5">
                <Zap className="text-orange-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Efficiency</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automated workflows and smart prioritization algorithms ensure focus
                on high-impact tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-slate-200/70 px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-between mb-14 max-w-6xl mx-auto absolute left-0 right-0 px-8 -mt-20 lg:static lg:mb-0">
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900">
            Ready to boost your productivity?
          </h2>
          <p className="mt-4 text-gray-600">
            Join thousands of high-performing teams already using TaskPilot to
            conquer their goals.
          </p>
          <Link
            href="/auth/register"
            className="inline-block mt-8 px-7 py-3.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="TaskPilot" width={24} height={24} />
              <span className="font-semibold text-gray-900">TaskPilot</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Productivity, accelerated.</p>
          </div>
          <p className="text-sm text-gray-500">© 2026 TaskPilot Inc.</p>
        </div>
      </footer>
    </div>
  )
}