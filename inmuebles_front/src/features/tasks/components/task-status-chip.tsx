import type { TaskStatus } from '@/store/slices/tasksSlice'

import { Chip } from '@heroui/chip'

import { getTaskStatusMeta } from '@/features/tasks/task-status'

interface TaskStatusChipProps {
  status: TaskStatus
}

export function TaskStatusChip({ status }: TaskStatusChipProps) {
  const meta = getTaskStatusMeta(status)

  return (
    <Chip color={meta.color} size="sm" variant="flat">
      {meta.label}
    </Chip>
  )
}
