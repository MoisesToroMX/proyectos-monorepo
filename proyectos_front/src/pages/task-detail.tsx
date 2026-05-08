import type { Task } from '@/store/slices/tasksSlice'

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
  deleteTask,
  fetchTasks,
  selectTaskById,
  updateTask,
} from '@/store/slices/tasksSlice'
import { fetchProjects, selectProjectById } from '@/store/slices/projectsSlice'
import { getErrorMessage } from '@/utils/errors'
import { useI18n } from '@/i18n/i18n-provider'

interface TaskDraft {
  description: string
  status: Task['status']
  title: string
}

const emptyTaskDraft: TaskDraft = {
  description: '',
  status: 'pendiente',
  title: '',
}

function toTaskDraft(task: Task): TaskDraft {
  return {
    description: task.description,
    status: task.status,
    title: task.title,
  }
}

export default function TaskDetailPage() {
  const { userId, projectId, taskId } = useParams<{
    userId: string
    projectId: string
    taskId: string
  }>()
  const dispatch = useAppDispatch()
  const { locale, t } = useI18n()
  const navigate = useNavigate()
  const currentTask = useAppSelector(state =>
    selectTaskById(state, Number(taskId))
  )
  const currentProject = useAppSelector(state =>
    selectProjectById(state, Number(projectId))
  )

  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createdAtLabel = useMemo(() => {
    if (!currentTask) {
      return ''
    }

    return new Date(currentTask.created_at).toLocaleDateString(
      locale === 'es' ? 'es-MX' : 'en-US'
    )
  }, [currentTask, locale])

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
            description: draft.description.trim(),
            status: draft.status,
            title: draft.title.trim(),
          },
        })
      ).unwrap()
      setIsEditing(false)
    } catch (error) {
      setError(getErrorMessage(error, t('taskDetail.saveError')))
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
      setError(getErrorMessage(error, t('taskDetail.deleteError')))
    }
  }

  const onCancel = () => {
    if (currentTask) {
      setDraft(toTaskDraft(currentTask))
    }

    setIsEditing(false)
  }

  const onStartEditing = () => {
    if (!currentTask) return

    setDraft(toTaskDraft(currentTask))
    setIsEditing(true)
  }

  if (!currentTask) {
    return (
      <Page>
        <LoadingState label={t('taskDetail.loading')} />
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
            {t('taskDetail.backToTasks')}
          </BackButton>
        }
        description={currentProject?.name ?? t('taskDetail.selectedProperty')}
        eyebrow={t('taskDetail.eyebrow')}
        title={currentTask.title}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Card className="border border-default-200" shadow="none">
        <CardHeader>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <Input
                  aria-label={t('taskDetail.titleAria')}
                  size="sm"
                  value={draft.title}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              ) : (
                <h2 className="truncate text-2xl font-semibold">
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
              {t('taskDetail.description')}
            </h3>
            {isEditing ? (
              <Textarea
                minRows={3}
                size="sm"
                value={draft.description}
                onChange={event =>
                  setDraft(current => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            ) : (
              <p className="text-default-600">{currentTask.description}</p>
            )}
          </section>

          {isEditing && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-default-400">
                {t('taskDetail.status')}
              </h3>
              <Select
                aria-label={t('taskDetail.statusAria')}
                items={TASK_STATUS_OPTIONS}
                selectedKeys={[draft.status]}
                size="sm"
                onSelectionChange={keys => {
                  const selected = Array.from(keys)[0]

                  if (typeof selected === 'string') {
                    setDraft(current => ({
                      ...current,
                      status: selected as Task['status'],
                    }))
                  }
                }}
              >
                {option => (
                  <SelectItem key={option.key}>{t(option.labelKey)}</SelectItem>
                )}
              </Select>
            </section>
          )}

          <dl className="grid gap-3 rounded-lg bg-default-50 p-4 text-sm text-default-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-default-500">
                {t('taskDetail.property')}
              </dt>
              <dd>{currentProject?.name ?? t('taskDetail.unnamed')}</dd>
            </div>
            <div>
              <dt className="font-medium text-default-500">
                {t('taskDetail.created')}
              </dt>
              <dd>{createdAtLabel}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  color="primary"
                  isLoading={saving}
                  size="sm"
                  variant="solid"
                  onPress={onSave}
                >
                  {t('taskDetail.save')}
                </Button>
                <Button size="sm" variant="flat" onPress={onCancel}>
                  {t('taskDetail.cancel')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  size="sm"
                  variant="solid"
                  onPress={onStartEditing}
                >
                  {t('taskDetail.edit')}
                </Button>
                <ConfirmDeleteButton
                  ariaLabel={t('taskDetail.delete')}
                  confirmMessage={t('tasks.deleteConfirm')}
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
