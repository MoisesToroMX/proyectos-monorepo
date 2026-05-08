import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { TaskForm } from '@/features/tasks/components/task-form'
import { renderWithProviders } from '@/test/render'

describe('TaskForm', () => {
  beforeEach(() => {
    window.localStorage.setItem('proyectos-locale', 'es')
  })

  it('keeps the create button aligned with compact inputs', () => {
    renderWithProviders(
      <TaskForm
        description="Descripción"
        isCreating={false}
        title="Tarea 1"
        onDescriptionChange={vi.fn()}
        onSubmit={vi.fn()}
        onTitleChange={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Crear' })).toHaveClass(
      'h-12',
      'min-h-12'
    )
  })
})
