import type { FormEvent } from 'react'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'

import { ProjectCard } from '@/features/projects/components/project-card'
import { ProjectForm } from '@/features/projects/components/project-form'
import {
  buildTasksByProject,
  filterProjects,
} from '@/features/projects/project-utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { createProject, fetchProjects } from '@/store/slices/projectsSlice'
import { fetchTasks } from '@/store/slices/tasksSlice'
import {
  EmptyState,
  LoadingState,
  MetricCard,
  Page,
  PageHeader,
  Toolbar,
} from '@/components/ui/page'
import { getErrorMessage } from '@/utils/errors'

export default function ProjectsPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: projects, status: projStatus } = useAppSelector(
    s => s.projects
  )
  const { items: tasks } = useAppSelector(s => s.tasks)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchTasks())
  }, [dispatch])

  const tasksByProject = useMemo(() => {
    return buildTasksByProject(tasks)
  }, [tasks])

  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchTerm)
  }, [projects, searchTerm])

  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'completed').length
  }, [tasks])

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreating(true)
    setError(null)

    try {
      await dispatch(
        createProject({
          name: name.trim(),
          description: description.trim(),
        })
      ).unwrap()
      setName('')
      setDescription('')
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo crear el inmueble'))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Page className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <PageHeader
        description="Administra propiedades, pendientes y avance operativo desde una vista limpia."
        eyebrow="Portafolio"
        title="Inmuebles"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Inmuebles" value={projects.length} />
        <MetricCard label="Tareas" value={tasks.length} />
        <MetricCard label="Completadas" value={completedTasks} />
      </div>

      <ProjectForm
        description={description}
        isCreating={creating}
        name={name}
        onDescriptionChange={setDescription}
        onNameChange={setName}
        onSubmit={onCreate}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Toolbar>
        <Input
          className="flex-1"
          placeholder="Buscar inmuebles..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
        {searchTerm && (
          <Button variant="flat" onPress={() => setSearchTerm('')}>
            Limpiar
          </Button>
        )}
      </Toolbar>

      {projStatus === 'loading' && (
        <LoadingState label="Cargando inmuebles..." />
      )}

      {projStatus !== 'loading' && filteredProjects.length === 0 && (
        <EmptyState
          action={
            searchTerm ? (
              <Button
                color="primary"
                variant="flat"
                onPress={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </Button>
            ) : null
          }
          description={
            searchTerm
              ? 'No hay inmuebles que coincidan con la búsqueda.'
              : 'Crea tu primer inmueble para empezar a organizar tareas.'
          }
          title={searchTerm ? 'Sin resultados' : 'Sin inmuebles'}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            taskCount={tasksByProject[project.id]?.length ?? 0}
            onOpen={() => navigate(`/user/${userId}/projects/${project.id}`)}
          />
        ))}
      </div>
    </Page>
  )
}
