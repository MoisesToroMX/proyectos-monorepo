import type { Project } from '@/store/slices/projectsSlice'
import type { Task } from '@/store/slices/tasksSlice'

import { describe, expect, it } from 'vitest'

import {
  buildTasksByProject,
  filterProjects,
} from '@/features/projects/project-utils'

const projects: Project[] = [
  {
    id: 1,
    name: 'Torre Norte',
    description: 'Departamentos premium',
    user_id: 1,
    created_at: '2026-05-08T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Bodega Sur',
    description: 'Naves industriales',
    user_id: 1,
    created_at: '2026-05-08T00:00:00.000Z',
  },
]

const tasks = [
  { id: 1, project_id: 1 },
  { id: 2, project_id: 1 },
  { id: 3, project_id: 2 },
] as Task[]

describe('project utils', () => {
  it('filters projects by name or description', () => {
    expect(filterProjects(projects, 'industrial')).toEqual([projects[1]])
  })

  it('groups tasks by project id', () => {
    expect(buildTasksByProject(tasks)[1]).toHaveLength(2)
  })
})
