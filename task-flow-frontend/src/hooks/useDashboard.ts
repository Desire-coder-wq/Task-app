import { useQuery } from '@tanstack/react-query'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useDashboardStats() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  })

  useEffect(() => {
    if (error && typeof error === 'object' && 'response' in error) {
      const status = (error as any).response?.status
      if (status === 401) {
        router.push('/auth/login')
      }
    }
  }, [error, router])

  return {
    stats: data || {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
      priorityStats: { high: 0, medium: 0, low: 0 },
    },
    isLoading,
    error,
  }
}
