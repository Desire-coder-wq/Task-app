import axios from 'axios';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  token: string;
}

export class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/login`, data);
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/register`, data);
    return response.data.data;
  }
}

export const authService = new AuthService();
