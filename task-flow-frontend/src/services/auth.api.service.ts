import axios from 'axios';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://taskflow-backend-yh8o.onrender.com/api';

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
    const response = await axios.post<ApiResponse<{ devOtp?: string }>>(
      `${API_URL}/auth/forgot-password`,
      data
    );
    return {
      message: response.data.message,
      devOtp: response.data.data?.devOtp,
    };
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<{ message: string }> {
    const response = await axios.post<ApiResponse<any>>(
      `${API_URL}/auth/verify-otp`,
      data
    );
    return { message: response.data.message };
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await axios.post<ApiResponse<any>>(
      `${API_URL}/auth/reset-password`,
      data
    );
    return { message: response.data.message };
  }
}

export const authApiService = new AuthApiService();
