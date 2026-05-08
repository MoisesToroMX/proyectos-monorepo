import type { RootState } from '@/store'

import { describe, expect, it } from 'vitest'

import tasksReducer, {
  selectCompletedTasksCount,
  selectTaskById,
  selectTasks,
  selectTasksByProject,
  selectTasksStatus,
  setTasks,
} from '@/store/slices/tasksSlice'

const pendingTask = {
  id: 1,
  title: 'Pintar sala',
  description: 'Comprar pintura',
  status: 'pending' as const,
  project_id: 10,
  user_id: 7,
  created_at: '2026-05-08T09:00:00Z',
}

const completedTask = {
  id: 2,
  title: 'Instalar focos',
  description: 'Focos led',
  status: 'completed' as const,
  project_id: 10,
  user_id: 7,
  created_at: '2026-05-08T10:00:00Z',
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
      items: [],
      status: 'idle',
    },
    tasks: {
      error: null,
      items: [pendingTask, completedTask],
      status: 'succeeded',
    },
  }
}

describe('tasks slice', () => {
  it('stores tasks through Redux reducers', () => {
    const state = tasksReducer(undefined, setTasks([pendingTask]))

    expect(state.items).toEqual([pendingTask])
  })

  it('selects and derives tasks from the Redux state', () => {
    const state = buildState()
    const tasksByProject = selectTasksByProject(state)

    expect(selectTasks(state)).toEqual([pendingTask, completedTask])
    expect(selectTasksStatus(state)).toBe('succeeded')
    expect(selectTaskById(state, 2)).toEqual(completedTask)
    expect(selectCompletedTasksCount(state)).toBe(1)
    expect(tasksByProject[10]).toEqual([pendingTask, completedTask])
  })
})
