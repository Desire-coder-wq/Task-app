import { useQuery } from '@tanstack/react-query'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'

export function useDashboardStats() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  })

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
