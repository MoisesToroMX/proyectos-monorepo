import type { Project } from '@/store/slices/projectsSlice'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'

interface ProjectCardProps {
  onOpen: () => void
  project: Project
  taskCount: number
}

export function ProjectCard({ onOpen, project, taskCount }: ProjectCardProps) {
  const taskLabel = taskCount === 1 ? 'tarea' : 'tareas'

  return (
    <Card
      className="border border-default-200 transition-transform hover:-translate-y-0.5 hover:shadow-md"
      shadow="sm"
    >
      <CardBody className="gap-4 p-5">
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
          <Button color="primary" size="sm" variant="flat" onPress={onOpen}>
            Ver operación
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
