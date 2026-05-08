import type { TaskStatus } from '@/store/slices/tasksSlice'

export const TASK_STATUS_OPTIONS = [
  {
    key: 'pending',
    labelKey: 'status.pending',
    color: 'warning',
  },
  {
    key: 'in progress',
    labelKey: 'status.inProgress',
    color: 'primary',
  },
  {
    key: 'completed',
    labelKey: 'status.completed',
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
