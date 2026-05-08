import { screen } from '@testing-library/react'
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
      <ProjectCard project={project} taskCount={1} onOpen={onOpen} />
    )

    expect(screen.queryByText('Ver operación')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /abrir proyecto: proyecto 1/i,
      })
    )

    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
