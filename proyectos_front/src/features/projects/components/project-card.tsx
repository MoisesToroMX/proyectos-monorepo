import type { Project } from '@/store/slices/projectsSlice'

import { Card, CardBody } from '@heroui/card'

import { useI18n } from '@/i18n/i18n-provider'

interface ProjectCardProps {
  onOpen: () => void
  project: Project
  taskCount: number
}

export function ProjectCard({ onOpen, project, taskCount }: ProjectCardProps) {
  const { t } = useI18n()
  const taskLabel =
    taskCount === 1 ? t('projects.taskSingular') : t('projects.taskPlural')

  return (
    <Card
      isPressable
      aria-label={`${t('projects.openProperty')}: ${project.name}`}
      className="border border-default-200 transition-colors hover:border-primary/60"
      shadow="none"
      onPress={onOpen}
    >
      <CardBody className="gap-4 p-4 text-left">
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
        </div>
      </CardBody>
    </Card>
  )
}
