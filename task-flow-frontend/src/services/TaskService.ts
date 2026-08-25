import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { PaginatedResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class TaskService {
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const response = await api.get('/tasks', { params: filters });
    return response.data.data as PaginatedResponse<Task>;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data as Task;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data as Task;
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data as Task;
  }

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data.data as Task;
  }
}

export const taskService = new TaskService();