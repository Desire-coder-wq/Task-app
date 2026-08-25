import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'
import { User } from '@/types/task'

export function useUsers() {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  })

  return {
    users: data || [],
    isLoading,
    error,
  }
}
