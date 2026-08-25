import { create } from 'zustand'
import { Task } from '@/types/task'

interface TaskState {
  selectedTask: Task | null
  isModalOpen: boolean
  modalMode: 'create' | 'edit' | 'delete' | null
  setSelectedTask: (task: Task | null) => void
  openModal: (mode: 'create' | 'edit' | 'delete', task?: Task) => void
  closeModal: () => void
}

export const useTaskStore = create<TaskState>((set) => ({
  selectedTask: null,
  isModalOpen: false,
  modalMode: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  openModal: (mode, task = undefined) =>
    set({ modalMode: mode, selectedTask: task, isModalOpen: true }),
  closeModal: () =>
    set({ isModalOpen: false, selectedTask: null, modalMode: null }),
}))