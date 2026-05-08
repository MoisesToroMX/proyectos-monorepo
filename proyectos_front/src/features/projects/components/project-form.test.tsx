import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { ProjectForm } from '@/features/projects/components/project-form'
import { renderWithProviders } from '@/test/render'

describe('ProjectForm', () => {
  beforeEach(() => {
    window.localStorage.setItem('proyectos-locale', 'es')
  })

  it('renders compact create copy and submits valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(event => event.preventDefault())

    renderWithProviders(
      <ProjectForm
        description="Descripción"
        isCreating={false}
        name="Proyecto 1"
        onDescriptionChange={vi.fn()}
        onNameChange={vi.fn()}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Crear' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Crear proyecto')).not.toBeInTheDocument()
  })

  it('reports input changes to the parent component', async () => {
    const user = userEvent.setup()
    const onNameChange = vi.fn()

    renderWithProviders(
      <ProjectForm
        description=""
        isCreating={false}
        name=""
        onDescriptionChange={vi.fn()}
        onNameChange={onNameChange}
        onSubmit={vi.fn()}
      />
    )

    await user.type(screen.getByLabelText(/nombre del proyecto/i), 'Casa')

    expect(onNameChange).toHaveBeenCalled()
  })
})
