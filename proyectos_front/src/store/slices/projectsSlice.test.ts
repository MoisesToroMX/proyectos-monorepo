import type { RootState } from '@/store'

import { describe, expect, it } from 'vitest'

import projectsReducer, {
  deleteProject,
  selectProjectById,
  selectProjects,
  selectProjectsStatus,
  setProjects,
  updateProject,
} from '@/store/slices/projectsSlice'

const project = {
  id: 1,
  name: 'Proyecto 1',
  description: 'Departamento en renta',
  user_id: 7,
  created_at: '2026-05-08T09:00:00Z',
}

function buildState(): RootState {
  return {
    auth: {
      error: null,
      status: 'idle',
      token: 'token',
      user: null,
    },
    projects: {
      error: null,
      items: [project],
      status: 'succeeded',
    },
    tasks: {
      error: null,
      items: [],
      status: 'idle',
    },
  }
}

describe('projects slice', () => {
  it('stores projects through Redux reducers', () => {
    const state = projectsReducer(undefined, setProjects([project]))

    expect(state.items).toEqual([project])
  })

  it('updates and deletes projects through Redux async reducers', () => {
    const updatedProject = {
      ...project,
      name: 'Proyecto actualizado',
    }
    let state = projectsReducer(undefined, setProjects([project]))

    state = projectsReducer(
      state,
      updateProject.fulfilled(updatedProject, 'request-id', {
        data: { name: updatedProject.name },
        project_id: project.id,
      })
    )

    expect(state.items[0]).toEqual(updatedProject)

    state = projectsReducer(
      state,
      deleteProject.fulfilled(project.id, 'request-id', {
        project_id: project.id,
      })
    )

    expect(state.items).toEqual([])
  })

  it('selects projects from the Redux state', () => {
    const state = buildState()

    expect(selectProjects(state)).toEqual([project])
    expect(selectProjectsStatus(state)).toBe('succeeded')
    expect(selectProjectById(state, 1)).toEqual(project)
    expect(selectProjectById(state, 99)).toBeUndefined()
  })
})
