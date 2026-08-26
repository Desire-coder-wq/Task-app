import axios, { type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Invitation {
  id: string;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  acceptUrl?: string;
}

export class InvitationService {
  async sendInvitation(email: string, name: string): Promise<Invitation> {
    const response = await api.post('/invitations', { email, name });
    return response.data.data;
  }

  async getInvitations(): Promise<Invitation[]> {
    const response = await api.get('/invitations');
    return response.data.data;
  }

  async resendInvitation(id: string): Promise<void> {
    await api.post(`/invitations/${id}/resend`);
  }

  async cancelInvitation(id: string): Promise<void> {
    await api.delete(`/invitations/${id}`);
  }

  async acceptInvitation(token: string, password: string): Promise<any> {
    const response = await api.post('/invitations/accept', { token, password });
    return response.data.data;
  }
}

export const invitationService = new InvitationService();