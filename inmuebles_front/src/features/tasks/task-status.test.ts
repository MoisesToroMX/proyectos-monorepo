import { describe, expect, it } from 'vitest'

import { getTaskStatusMeta } from '@/features/tasks/task-status'

describe('getTaskStatusMeta', () => {
  it('returns the label key and color for a task status', () => {
    expect(getTaskStatusMeta('completada')).toMatchObject({
      labelKey: 'status.completed',
      color: 'success',
    })
  })
})
