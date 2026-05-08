import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectCard } from '@/features/projects/components/project-card'
import { renderWithProviders } from '@/test/render'

const project = {
  created_at: '2026-05-08T00:00:00Z',
  description: 'Muy bueno',
  id: 1,
  name: 'Proyecto 1',
  user_id: 3,
}

describe('ProjectCard', () => {
  beforeEach(() => {
    window.localStorage.setItem('proyectos-locale', 'es')
  })

  it('opens by clicking the card and does not render a detail button', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    renderWithProviders(
      <ProjectCard
        project={project}
        taskCount={1}
        onDelete={vi.fn()}
        onOpen={onOpen}
      />
    )

    expect(screen.queryByText('Ver operación')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /abrir proyecto: proyecto 1/i,
      })
    )

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('deletes with a modal without opening the project', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const onOpen = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm')

    renderWithProviders(
      <ProjectCard
        project={project}
        taskCount={1}
        onDelete={onDelete}
        onOpen={onOpen}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))

    const dialog = screen.getByRole('dialog')

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(
      within(dialog).getByText('¿Deseas eliminar el proyecto Proyecto 1?')
    ).toBeVisible()

    await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onOpen).not.toHaveBeenCalled()
  })
})
