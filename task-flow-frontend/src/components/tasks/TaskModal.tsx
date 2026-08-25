'use client'

import { useTaskStore } from '@/store/TaskStore'
import { useTasks } from '@/hooks/useTasks'
import { TaskForm } from './TaskForm'
import { X } from 'lucide-react'

export function TaskModal() {
  const { isModalOpen, modalMode, selectedTask, closeModal } = useTaskStore()
  const { createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting } = useTasks()

  if (!isModalOpen) return null

  const handleSubmit = (data: any) => {
    if (modalMode === 'create') {
      createTask(data)
      closeModal()
    } else if (modalMode === 'edit' && selectedTask) {
      updateTask({ id: selectedTask.id, data })
      closeModal()
    }
  }

  const handleDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id)
      closeModal()
    }
  }

  const isSubmitting = isCreating || isUpdating || isDeleting

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {modalMode === 'create' && 'Create New Task'}
            {modalMode === 'edit' && 'Edit Task'}
            {modalMode === 'delete' && 'Delete Task'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {modalMode === 'delete' ? (
            <div>
              <p className="text-gray-700">
                Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <TaskForm
              initialData={selectedTask || undefined}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}