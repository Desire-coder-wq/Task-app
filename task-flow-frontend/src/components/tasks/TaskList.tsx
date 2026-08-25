'use client'

import { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { useTaskStore } from '@/store/task.store'
import { useTasks } from '@/hooks/useTasks'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const { openModal, setSelectedTask } = useTaskStore()
  const { updateStatus, deleteTask } = useTasks()

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    openModal('edit')
  }

  const handleDelete = (task: Task) => {
    setSelectedTask(task)
    openModal('delete')
  }

  const handleStatusChange = (task: Task, status: string) => {
    updateStatus({ id: task.id, status })
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  )
}