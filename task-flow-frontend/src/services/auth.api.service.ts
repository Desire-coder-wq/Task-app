import axios from 'axios';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export class AuthApiService {
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string; devOtp?: string }> {
    const response = await axios.post<ApiResponse<{ message: string; devOtp?: string }>>(
      `${API_URL}/auth/forgot-password`,
      data
    );
    return response.data.data;
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<{ message: string }> {
    const response = await axios.post<ApiResponse<{ message: string }>>(
      `${API_URL}/auth/verify-otp`,
      data
    );
    return response.data.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await axios.post<ApiResponse<{ message: string }>>(
      `${API_URL}/auth/reset-password`,
      data
    );
    return response.data.data;
  }
}

export const authApiService = new AuthApiService();
