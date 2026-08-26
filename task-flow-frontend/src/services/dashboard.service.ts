import axios from 'axios';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

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
    const response = await axios.get<ApiResponse<DashboardStats>>(`${API_URL}/dashboard/stats`);
    return response.data.data;
  }

  async getUpcoming(): Promise<UpcomingDeadline[]> {
    const response = await axios.get<ApiResponse<UpcomingDeadline[]>>(`${API_URL}/dashboard/upcoming`);
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
