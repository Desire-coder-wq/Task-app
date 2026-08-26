import axios, { type InternalAxiosRequestConfig } from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { PaginatedResponse } from '@/types/api';
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

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
    return response.data.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data;
  }

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data.data;
  }
}

export const taskService = new TaskService();