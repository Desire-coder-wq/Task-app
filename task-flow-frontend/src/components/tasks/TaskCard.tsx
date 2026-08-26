'use client';

import { Task, TaskStatus } from '@/types/task';
import { Calendar, User, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const statusConfig = {
  TODO: { label: 'To Do', className: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800' },
};

const priorityConfig = {
  LOW: { label: 'Low', className: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Medium', className: 'bg-orange-100 text-orange-800' },
  HIGH: { label: 'High', className: 'bg-red-100 text-red-800' },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStatusChange = (status: TaskStatus) => {
    onStatusChange(task, status);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key as TaskStatus)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      task.status === key ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 ${statusConfig[task.status].className}`}
        >
          {statusConfig[task.status].label}
        </button>

        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityConfig[task.priority].className}`}>
          {priorityConfig[task.priority].label}
        </span>

        {task.assignedUser && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User size={12} />
            <span>{task.assignedUser.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}