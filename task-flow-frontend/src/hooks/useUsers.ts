import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useUsers(teamId?: string) {
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users', teamId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (teamId) params.append('teamId', teamId);
      const response = await api.get(`/users?${params.toString()}`);
      return response.data.data;
    },
  });

  return { users, isLoading, error };
}