import { useQuery } from '@tanstack/react-query'
import { usersService, type User } from '@/services/users.service'

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
