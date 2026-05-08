import type { Task } from '@/store/slices/tasksSlice'

import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'

import { ConfirmDeleteButton } from '@/components/ui/confirm-delete-button'
import { TaskStatusChip } from '@/features/tasks/components/task-status-chip'

interface TaskCardProps {
  onDelete: () => Promise<void>
  onOpen: () => void
  task: Task
}

export function TaskCard({ onDelete, onOpen, task }: TaskCardProps) {
  return (
    <Card
      className="border border-default-200 transition-transform hover:-translate-y-0.5 hover:shadow-md"
      shadow="sm"
    >
      <CardBody className="gap-4 p-5">
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
        <div className="flex justify-end gap-2">
          <Button color="primary" size="sm" variant="flat" onPress={onOpen}>
            Ver detalle
          </Button>
          <ConfirmDeleteButton
            confirmMessage="¿Eliminar esta tarea?"
            onConfirm={onDelete}
          />
        </div>
      </CardBody>
    </Card>
  )
}
