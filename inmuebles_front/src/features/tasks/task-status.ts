import type { TaskStatus } from '@/store/slices/tasksSlice'

export const TASK_STATUS_OPTIONS = [
  {
    key: 'pending',
    label: 'Pendiente',
    color: 'warning',
  },
  {
    key: 'in progress',
    label: 'En progreso',
    color: 'primary',
  },
  {
    key: 'completed',
    label: 'Completada',
    color: 'success',
  },
] as const

export type TaskStatusFilter = TaskStatus | 'all'

export function getTaskStatusMeta(status: TaskStatus) {
  return (
    TASK_STATUS_OPTIONS.find(option => option.key === status) ??
    TASK_STATUS_OPTIONS[0]
  )
}
