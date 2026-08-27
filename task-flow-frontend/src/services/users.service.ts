import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/task';

export class UsersService {
  async getUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  }
}

export const usersService = new UsersService();
