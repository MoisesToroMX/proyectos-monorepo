import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TaskCard } from '@/features/tasks/components/task-card'
import { renderWithProviders } from '@/test/render'

const task = {
  created_at: '2026-05-08T00:00:00Z',
  description: 'ser amigo',
  id: 1,
  project_id: 1,
  status: 'pending' as const,
  title: 'tarea 1',
  user_id: 3,
}

describe('TaskCard', () => {
  beforeEach(() => {
    window.localStorage.setItem('inmuebles-locale', 'es')
  })

  it('opens from the card instead of a detail button', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    renderWithProviders(
      <TaskCard task={task} onDelete={vi.fn()} onOpen={onOpen} />
    )

    expect(screen.queryByText('Ver detalle')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /abrir tarea: tarea 1/i,
      })
    )

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('uses a red icon delete action without opening the card', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const onOpen = vi.fn()

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithProviders(
      <TaskCard task={task} onDelete={onDelete} onOpen={onOpen} />
    )

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onOpen).not.toHaveBeenCalled()
  })
})
