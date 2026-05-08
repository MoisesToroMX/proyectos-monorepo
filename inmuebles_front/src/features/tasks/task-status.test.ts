import { describe, expect, it } from 'vitest'

import { getTaskStatusMeta } from '@/features/tasks/task-status'

describe('getTaskStatusMeta', () => {
  it('returns the Spanish label and color for a task status', () => {
    expect(getTaskStatusMeta('completed')).toMatchObject({
      label: 'Completada',
      color: 'success',
    })
  })
})
