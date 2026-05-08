import type { FormEvent } from 'react'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'

import { TaskCard } from '@/features/tasks/components/task-card'
import { TaskForm } from '@/features/tasks/components/task-form'
import {
  TASK_STATUS_OPTIONS,
  TaskStatusFilter,
} from '@/features/tasks/task-status'
import { filterTasks } from '@/features/tasks/task-utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { createTask, deleteTask, fetchTasks } from '@/store/slices/tasksSlice'
import { fetchProjects } from '@/store/slices/projectsSlice'
import {
  BackButton,
  EmptyState,
  LoadingState,
  MetricCard,
  Page,
  PageHeader,
  Toolbar,
} from '@/components/ui/page'
import { getErrorMessage } from '@/utils/errors'

const TASK_FILTER_OPTIONS = [
  {
    key: 'all',
    label: 'Todos',
  },
  ...TASK_STATUS_OPTIONS.map(option => ({
    key: option.key,
    label: option.label,
  })),
]

export default function TasksPage() {
  const { userId, projectId } = useParams<{
    userId: string
    projectId: string
  }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: tasks, status } = useAppSelector(state => state.tasks)
  const { items: projects } = useAppSelector(state => state.projects)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all')
  const [error, setError] = useState<string | null>(null)

  const currentProject = useMemo(() => {
    return projects.find(project => project.id === Number(projectId))
  }, [projectId, projects])

  useEffect(() => {
    dispatch(fetchProjects())

    if (projectId) {
      dispatch(fetchTasks({ project_id: Number(projectId) }))
    }
  }, [dispatch, projectId])

  const onCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!projectId) return

    setCreating(true)
    setError(null)

    try {
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          project_id: Number(projectId),
        })
      ).unwrap()
      setTitle('')
      setDescription('')
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo crear la tarea'))
    } finally {
      setCreating(false)
    }
  }

  const onTaskClick = (taskId: number) => {
    navigate(`/user/${userId}/projects/${projectId}/tasks/${taskId}`)
  }

  const onDeleteTask = async (taskId: number) => {
    setError(null)

    try {
      await dispatch(deleteTask({ task_id: taskId })).unwrap()
    } catch (error) {
      setError(getErrorMessage(error, 'Error al eliminar la tarea'))
    }
  }

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, searchTerm, statusFilter)
  }, [tasks, searchTerm, statusFilter])

  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'completed').length
  }, [tasks])

  return (
    <Page className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <PageHeader
        actions={
          <BackButton onPress={() => navigate(`/user/${userId}/projects`)}>
            Volver a inmuebles
          </BackButton>
        }
        description={
          currentProject?.description ??
          'Seguimiento operativo del inmueble seleccionado.'
        }
        eyebrow="Tareas"
        title={currentProject?.name ?? 'Inmueble'}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Tareas" value={tasks.length} />
        <MetricCard label="Pendientes" value={tasks.length - completedTasks} />
        <MetricCard label="Completadas" value={completedTasks} />
      </div>

      <TaskForm
        description={description}
        isCreating={creating}
        title={title}
        onDescriptionChange={setDescription}
        onSubmit={onCreateTask}
        onTitleChange={setTitle}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Toolbar>
        <Input
          className="flex-1"
          placeholder="Buscar tareas..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
        <Select
          aria-label="Filtrar por estado"
          className="w-full sm:w-56"
          items={TASK_FILTER_OPTIONS}
          placeholder="Filtrar por estado"
          selectedKeys={[statusFilter]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0]

            if (typeof selected === 'string') {
              setStatusFilter(selected as TaskStatusFilter)
            }
          }}
        >
          {option => <SelectItem key={option.key}>{option.label}</SelectItem>}
        </Select>
        {(searchTerm || statusFilter !== 'all') && (
          <Button
            variant="flat"
            onPress={() => {
              setSearchTerm('')
              setStatusFilter('all')
            }}
          >
            Limpiar
          </Button>
        )}
      </Toolbar>

      {status === 'loading' && <LoadingState label="Cargando tareas..." />}

      {filteredTasks.length === 0 && status !== 'loading' && (
        <EmptyState
          description={
            tasks.length === 0
              ? 'Crea una tarea para empezar el seguimiento.'
              : 'No se encontraron tareas con los filtros aplicados.'
          }
          title={tasks.length === 0 ? 'Sin tareas' : 'Sin resultados'}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onDeleteTask(task.id)}
            onOpen={() => onTaskClick(task.id)}
          />
        ))}
      </div>
    </Page>
  )
}
