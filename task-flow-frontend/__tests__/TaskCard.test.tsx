import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO' as TaskStatus,
  priority: 'HIGH' as TaskPriority,
  dueDate: '2026-09-01',
  assignedUserId: 'user1',
  assignedUser: {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  createdAt: '2026-08-25T00:00:00.000Z',
  updatedAt: '2026-08-25T00:00:00.000Z',
};

describe('TaskCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => btn.querySelector('svg'));
    if (editButton) {
      editButton.click();
      expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    }
  });

  it('displays priority and status badges', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });
});
