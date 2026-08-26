import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  priorityStats: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedUser: {
    id: string;
    name: string;
    email: string;
  };
}

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  }

  async getUpcoming(): Promise<UpcomingDeadline[]> {
    const response = await api.get<ApiResponse<UpcomingDeadline[]>>('/dashboard/upcoming');
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
