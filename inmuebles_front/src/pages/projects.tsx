import type { FormEvent } from 'react'

import { useEffect, useMemo, useReducer } from 'react'
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

interface ProjectsPageState {
  creating: boolean
  description: string
  error: string | null
  name: string
  searchTerm: string
}

const initialProjectsPageState: ProjectsPageState = {
  creating: false,
  description: '',
  error: null,
  name: '',
  searchTerm: '',
}

function mergeProjectsPageState(
  state: ProjectsPageState,
  patch: Partial<ProjectsPageState>
) {
  return { ...state, ...patch }
}

export default function ProjectsPage() {
  const { userId } = useParams<{ userId: string }>()
  const { t } = useI18n()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: projects, status: projStatus } = useAppSelector(
    s => s.projects
  )
  const { items: tasks } = useAppSelector(s => s.tasks)
  const [pageState, setPageState] = useReducer(
    mergeProjectsPageState,
    initialProjectsPageState
  )
  const { creating, description, error, name, searchTerm } = pageState

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
    setPageState({ creating: true, error: null })

    try {
      await dispatch(
        createProject({
          name: name.trim(),
          description: description.trim(),
        })
      ).unwrap()
      setPageState({ description: '', name: '' })
    } catch (error) {
      setPageState({
        error: getErrorMessage(error, t('projects.createError')),
      })
    } finally {
      setPageState({ creating: false })
    }
  }

  return (
    <Page className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <PageHeader
        description={t('projects.description')}
        eyebrow={t('projects.eyebrow')}
        title={t('projects.title')}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label={t('projects.metricProperties')}
          value={projects.length}
        />
        <MetricCard label={t('projects.metricTasks')} value={tasks.length} />
        <MetricCard
          label={t('projects.metricCompleted')}
          value={completedTasks}
        />
      </div>

      <ProjectForm
        description={description}
        isCreating={creating}
        name={name}
        onDescriptionChange={nextDescription =>
          setPageState({ description: nextDescription })
        }
        onNameChange={nextName => setPageState({ name: nextName })}
        onSubmit={onCreate}
      />
      {error && <p className="text-sm text-danger">{error}</p>}

      <Toolbar>
        <Input
          className="flex-1"
          placeholder={t('projects.search')}
          size="sm"
          value={searchTerm}
          onChange={event => setPageState({ searchTerm: event.target.value })}
        />
        {searchTerm && (
          <ClearFiltersButton
            onPress={() => setPageState({ searchTerm: '' })}
          />
        )}
      </Toolbar>

      {projStatus === 'loading' && (
        <LoadingState label={t('projects.loading')} />
      )}

      {projStatus !== 'loading' && filteredProjects.length === 0 && (
        <EmptyState
          action={
            searchTerm ? (
              <Button
                color="primary"
                size="sm"
                variant="solid"
                onPress={() => setPageState({ searchTerm: '' })}
              >
                {t('projects.clearSearch')}
              </Button>
            ) : null
          }
          description={
            searchTerm
              ? t('projects.noResultsDescription')
              : t('projects.emptyDescription')
          }
          title={searchTerm ? t('projects.noResults') : t('projects.empty')}
        />
      )}

      <ScrollableList className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            taskCount={tasksByProject[project.id]?.length ?? 0}
            onOpen={() => navigate(`/user/${userId}/projects/${project.id}`)}
          />
        ))}
      </ScrollableList>
    </Page>
  )
}
