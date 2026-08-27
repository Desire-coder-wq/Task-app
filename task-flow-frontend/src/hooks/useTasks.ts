import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, TaskFilters } from '@/services/TaskService';
import { CreateTaskDto, UpdateTaskDto, TaskStatus, Task } from '@/types/task';
import { PaginatedResponse } from '@/types/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useTasks() {
  const [filters, setFilters] = useState<TaskFilters>({});
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<PaginatedResponse<Task>, Error>({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  return {
    tasks: data?.items || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      totalPages: data?.totalPages || 0,
    },
    isLoading,
    error,
    filters,
    setFilters,
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutate,
    updateTaskAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutate,
    deleteTaskAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateStatus: statusMutation.mutate,
    isUpdatingStatus: statusMutation.isPending,
  };
}