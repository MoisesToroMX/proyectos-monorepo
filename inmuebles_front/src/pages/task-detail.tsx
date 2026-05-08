import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'

import { ConfirmDeleteButton } from '@/components/ui/confirm-delete-button'
import {
  BackButton,
  LoadingState,
  Page,
  PageHeader,
} from '@/components/ui/page'
import { TaskStatusChip } from '@/features/tasks/components/task-status-chip'
import { TASK_STATUS_OPTIONS } from '@/features/tasks/task-status'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchTasks,
  updateTask,
  deleteTask,
  Task,
} from '@/store/slices/tasksSlice'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { getErrorMessage } from '@/utils/errors'

export default function TaskDetailPage() {
  const { userId, projectId, taskId } = useParams<{
    userId: string
    projectId: string
    taskId: string
  }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: tasks } = useAppSelector(state => state.tasks)
  const { items: projects } = useAppSelector(state => state.projects)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('pending')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentTask = useMemo(() => {
    return tasks.find(task => task.id === Number(taskId))
  }, [taskId, tasks])

  const currentProject = useMemo(() => {
    return projects.find(project => project.id === Number(projectId))
  }, [projectId, projects])

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title)
      setDescription(currentTask.description)
      setStatus(currentTask.status)
    }
  }, [currentTask])

  useEffect(() => {
    dispatch(fetchProjects())

    if (projectId) {
      dispatch(fetchTasks({ project_id: Number(projectId) }))
    }
  }, [dispatch, projectId])

  const onSave = async () => {
    if (!taskId) return

    setSaving(true)
    setError(null)

    try {
      await dispatch(
        updateTask({
          task_id: Number(taskId),
          data: {
            title: title.trim(),
            description: description.trim(),
            status,
          },
        })
      ).unwrap()
      setIsEditing(false)
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo guardar la tarea'))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!taskId) return

    setError(null)

    try {
      await dispatch(deleteTask({ task_id: Number(taskId) })).unwrap()
      navigate(`/user/${userId}/projects/${projectId}/tasks`)
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo eliminar la tarea'))
    }
  }

  const onCancel = () => {
    if (currentTask) {
      setTitle(currentTask.title)
      setDescription(currentTask.description)
      setStatus(currentTask.status)
    }

    setIsEditing(false)
  }

  if (!currentTask) {
    return (
      <Page>
        <LoadingState label="Cargando tarea..." />
      </Page>
    )
  }

  return (
    <Page className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <PageHeader
        actions={
          <BackButton
            onPress={() =>
              navigate(`/user/${userId}/projects/${projectId}/tasks`)
            }
          >
            Volver a tareas
          </BackButton>
        }
        description={currentProject?.name ?? 'Inmueble seleccionado'}
        eyebrow="Detalle"
        title={currentTask.title}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Card className="border border-default-200" shadow="sm">
        <CardHeader>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <Input
                  aria-label="Título de la tarea"
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                />
              ) : (
                <h2 className="truncate text-2xl font-bold">
                  {currentTask.title}
                </h2>
              )}
            </div>
            <TaskStatusChip status={currentTask.status} />
          </div>
        </CardHeader>
        <CardBody className="gap-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-default-400">
              Descripción
            </h3>
            {isEditing ? (
              <Textarea
                minRows={3}
                value={description}
                onChange={event => setDescription(event.target.value)}
              />
            ) : (
              <p className="text-default-600">{currentTask.description}</p>
            )}
          </section>

          {isEditing && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-default-400">
                Estado
              </h3>
              <Select
                aria-label="Estado de la tarea"
                items={TASK_STATUS_OPTIONS}
                selectedKeys={[status]}
                onSelectionChange={keys => {
                  const selected = Array.from(keys)[0]

                  if (typeof selected === 'string') {
                    setStatus(selected as Task['status'])
                  }
                }}
              >
                {option => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                )}
              </Select>
            </section>
          )}

          <dl className="grid gap-3 rounded-lg bg-default-50 p-4 text-sm text-default-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-default-500">Inmueble</dt>
              <dd>{currentProject?.name ?? 'Sin nombre'}</dd>
            </div>
            <div>
              <dt className="font-medium text-default-500">Creado</dt>
              <dd>{new Date(currentTask.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap justify-end gap-2">
            {isEditing ? (
              <>
                <Button color="primary" isLoading={saving} onPress={onSave}>
                  Guardar
                </Button>
                <Button variant="flat" onPress={onCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => setIsEditing(true)}
                >
                  Editar
                </Button>
                <ConfirmDeleteButton
                  confirmMessage="¿Eliminar esta tarea?"
                  label="Eliminar tarea"
                  onConfirm={onDelete}
                />
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </Page>
  )
}
