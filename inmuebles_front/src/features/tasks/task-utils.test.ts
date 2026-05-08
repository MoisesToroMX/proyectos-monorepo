import type { Task } from '@/store/slices/tasksSlice'

import { describe, expect, it } from 'vitest'

import { filterTasks } from '@/features/tasks/task-utils'

const tasks: Task[] = [
  {
    id: 1,
    title: 'Avalúo pendiente',
    description: 'Solicitar documentos de la propiedad',
    status: 'pending',
    project_id: 1,
    user_id: 1,
    created_at: '2026-05-08T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Contrato firmado',
    description: 'Expediente legal completo',
    status: 'completed',
    project_id: 1,
    user_id: 1,
    created_at: '2026-05-08T00:00:00.000Z',
  },
]

describe('filterTasks', () => {
  it('filters by text and status together', () => {
    const result = filterTasks(tasks, 'contrato', 'completed')

    expect(result).toEqual([tasks[1]])
  })
})
