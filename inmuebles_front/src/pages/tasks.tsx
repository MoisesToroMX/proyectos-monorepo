import type { FormEvent } from 'react'

import { useEffect, useMemo, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  ClearFiltersButton,
  EmptyState,
  LoadingState,
  MetricCard,
  Page,
  PageHeader,
  ScrollableList,
  Toolbar,
} from '@/components/ui/page'
import { getErrorMessage } from '@/utils/errors'
import { useI18n } from '@/i18n/i18n-provider'

interface TasksPageState {
  creating: boolean
  description: string
  error: string | null
  searchTerm: string
  statusFilter: TaskStatusFilter
  title: string
}

const initialTasksPageState: TasksPageState = {
  creating: false,
  description: '',
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  title: '',
}

function mergeTasksPageState(
  state: TasksPageState,
  patch: Partial<TasksPageState>
) {
  return { ...state, ...patch }
}

export default function TasksPage() {
  const { userId, projectId } = useParams<{
    userId: string
    projectId: string
  }>()
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { items: tasks, status } = useAppSelector(state => state.tasks)
  const { items: projects } = useAppSelector(state => state.projects)
  const [pageState, setPageState] = useReducer(
    mergeTasksPageState,
    initialTasksPageState
  )
  const { creating, description, error, searchTerm, statusFilter, title } =
    pageState

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

    setPageState({ creating: true, error: null })

    try {
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          project_id: Number(projectId),
        })
      ).unwrap()
      setPageState({ description: '', title: '' })
    } catch (error) {
      setPageState({ error: getErrorMessage(error, t('tasks.createError')) })
    } finally {
      setPageState({ creating: false })
    }
  }

  const onTaskClick = (taskId: number) => {
    navigate(`/user/${userId}/projects/${projectId}/tasks/${taskId}`)
  }

  const onDeleteTask = async (taskId: number) => {
    setPageState({ error: null })

    try {
      await dispatch(deleteTask({ task_id: taskId })).unwrap()
    } catch (error) {
      setPageState({ error: getErrorMessage(error, t('tasks.deleteError')) })
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
            {t('tasks.backToProperties')}
          </BackButton>
        }
        description={
          currentProject?.description ?? t('tasks.selectedPropertyDescription')
        }
        eyebrow={t('tasks.eyebrow')}
        title={currentProject?.name ?? t('tasks.selectedProperty')}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t('tasks.metricTasks')} value={tasks.length} />
        <MetricCard
          label={t('tasks.metricPending')}
          value={tasks.length - completedTasks}
        />
        <MetricCard label={t('tasks.metricCompleted')} value={completedTasks} />
      </div>

      <TaskForm
        description={description}
        isCreating={creating}
        title={title}
        onDescriptionChange={nextDescription =>
          setPageState({ description: nextDescription })
        }
        onSubmit={onCreateTask}
        onTitleChange={nextTitle => setPageState({ title: nextTitle })}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Toolbar>
        <Input
          className="flex-1"
          placeholder={t('tasks.search')}
          size="sm"
          value={searchTerm}
          onChange={event => setPageState({ searchTerm: event.target.value })}
        />
        <Select
          aria-label={t('tasks.filterByStatus')}
          className="w-full sm:w-56"
          items={[
            { key: 'all', label: t('status.all') },
            ...TASK_STATUS_OPTIONS.map(option => ({
              key: option.key,
              label: t(option.labelKey),
            })),
          ]}
          placeholder={t('tasks.filterByStatus')}
          selectedKeys={[statusFilter]}
          size="sm"
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0]

            if (typeof selected === 'string') {
              setPageState({ statusFilter: selected as TaskStatusFilter })
            }
          }}
        >
          {option => <SelectItem key={option.key}>{option.label}</SelectItem>}
        </Select>
        {(searchTerm || statusFilter !== 'all') && (
          <ClearFiltersButton
            onPress={() => {
              setPageState({ searchTerm: '', statusFilter: 'all' })
            }}
          />
        )}
      </Toolbar>

      {status === 'loading' && <LoadingState label={t('tasks.loading')} />}

      {filteredTasks.length === 0 && status !== 'loading' && (
        <EmptyState
          description={
            tasks.length === 0
              ? t('tasks.emptyDescription')
              : t('tasks.noResultsDescription')
          }
          title={tasks.length === 0 ? t('tasks.empty') : t('tasks.noResults')}
        />
      )}

      <ScrollableList className="grid gap-4 lg:grid-cols-2">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onDeleteTask(task.id)}
            onOpen={() => onTaskClick(task.id)}
          />
        ))}
      </ScrollableList>
    </Page>
  )
}
