import type { TaskStatus } from '@/store/slices/tasksSlice'

import { Chip } from '@heroui/chip'

import { getTaskStatusMeta } from '@/features/tasks/task-status'
import { useI18n } from '@/i18n/i18n-provider'

interface TaskStatusChipProps {
  status: TaskStatus
}

export function TaskStatusChip({ status }: TaskStatusChipProps) {
  const { t } = useI18n()
  const meta = getTaskStatusMeta(status)

  return (
    <Chip color={meta.color} size="sm" variant="flat">
      {t(meta.labelKey)}
    </Chip>
  )
}
