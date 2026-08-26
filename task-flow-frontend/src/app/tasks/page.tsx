'use client';

import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskModal } from '@/components/tasks/TaskModal';
import { useTasks } from '@/hooks/useTasks';
import { useTaskStore } from '@/store/TaskStore';
import { Layout } from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';

export default function TasksPage() {
  const { tasks, isLoading, error, filters, setFilters, updateStatus, deleteTask } = useTasks();
  const { openModal, setSelectedTask } = useTaskStore();

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    openModal('edit')
  }

  const handleDelete = (task: Task) => {
    setSelectedTask(task)
    openModal('delete')
  }

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    updateStatus({ id: task.id, status })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500">Manage your tasks efficiently</p>
          </div>
          <button
            onClick={() => openModal('create')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        <TaskFilters filters={filters} onFilterChange={setFilters} />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-600">Error loading tasks. Please try again.</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-1">Create your first task to get started</p>
            <button
              onClick={() => openModal('create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <TaskModal />
    </Layout>
  );
}