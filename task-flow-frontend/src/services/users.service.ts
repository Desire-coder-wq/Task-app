import axios from 'axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface UsersResponse {
  items: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class UsersService {
  async getUsers(): Promise<User[]> {
    const response = await axios.get<ApiResponse<UsersResponse>>(`${API_URL}/users`);
    return response.data.data.items;
  }
}

export const usersService = new UsersService();
