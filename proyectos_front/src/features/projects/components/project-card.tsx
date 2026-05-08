import type { Project } from '@/store/slices/projectsSlice'
import type { KeyboardEvent } from 'react'

import { Card, CardBody } from '@heroui/card'

import { ConfirmDeleteButton } from '@/components/ui/confirm-delete-button'
import { useI18n } from '@/i18n/i18n-provider'

interface ProjectCardProps {
  onDelete: () => Promise<void>
  onOpen: () => void
  project: Project
  taskCount: number
}

export function ProjectCard({
  onDelete,
  onOpen,
  project,
  taskCount,
}: ProjectCardProps) {
  const { t } = useI18n()
  const taskLabel =
    taskCount === 1 ? t('projects.taskSingular') : t('projects.taskPlural')

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
        aria-label={`${t('projects.openProperty')}: ${project.name}`}
        className="cursor-pointer gap-4 p-4 text-left"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {project.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-default-500">
            {project.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-default-100 px-3 py-1 text-xs font-medium text-default-600">
            {taskCount} {taskLabel}
          </span>
          <ConfirmDeleteButton
            ariaLabel={t('common.delete')}
            modalTitle={t('projects.deleteTitle').replace(
              '{name}',
              project.name
            )}
            onConfirm={onDelete}
          />
        </div>
      </CardBody>
    </Card>
  )
}
