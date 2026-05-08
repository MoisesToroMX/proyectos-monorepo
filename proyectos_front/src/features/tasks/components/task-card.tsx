import type { Task } from '@/store/slices/tasksSlice'
import type { KeyboardEvent } from 'react'

import { Card, CardBody } from '@heroui/card'

import { ConfirmDeleteButton } from '@/components/ui/confirm-delete-button'
import { TaskStatusChip } from '@/features/tasks/components/task-status-chip'
import { useI18n } from '@/i18n/i18n-provider'

interface TaskCardProps {
  onDelete: () => Promise<void>
  onOpen: () => void
  task: Task
}

export function TaskCard({ onDelete, onOpen, task }: TaskCardProps) {
  const { t } = useI18n()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    onOpen()
  }

  return (
    <Card
      className="border border-default-200 transition-colors hover:border-primary/60"
      shadow="none"
    >
      <CardBody
        aria-label={`${t('tasks.openTask')}: ${task.title}`}
        className="cursor-pointer gap-4 p-4 text-left"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-foreground">
              {task.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-default-500">
              {task.description}
            </p>
          </div>
          <TaskStatusChip status={task.status} />
        </div>
        <div className="flex justify-end">
          <ConfirmDeleteButton
            ariaLabel={t('common.delete')}
            confirmMessage={t('tasks.deleteConfirm')}
            onConfirm={onDelete}
          />
        </div>
      </CardBody>
    </Card>
  )
}
