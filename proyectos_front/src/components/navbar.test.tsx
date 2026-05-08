import { ReactNode } from 'react'
import { HeroUIProvider } from '@heroui/system'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { MemoryRouter, useHref, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { Navbar } from '@/components/navbar'
import { I18nProvider } from '@/i18n/i18n-provider'
import authReducer from '@/store/slices/authSlice'
import projectsReducer from '@/store/slices/projectsSlice'
import tasksReducer from '@/store/slices/tasksSlice'

interface RenderNavbarOptions {
  initialEntry?: string
}

function TestHeroUIProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  )
}

function renderNavbar({
  initialEntry = '/user/3/projects',
}: RenderNavbarOptions = {}) {
  const store = configureStore({
    preloadedState: {
      auth: {
        error: null,
        status: 'succeeded' as const,
        token: 'token',
        user: {
          created_at: '2026-05-08T09:00:00Z',
          email: 'qa@example.com',
          id: 3,
          name: 'QA',
        },
      },
      projects: {
        error: null,
        items: [],
        status: 'idle' as const,
      },
      tasks: {
        error: null,
        items: [
          {
            created_at: '2026-05-08T09:30:00Z',
            description: 'Hay que jugar para ganar',
            id: 7,
            project_id: 12,
            status: 'pendiente' as const,
            title: 'Tarea 3 del PY 1',
            user_id: 3,
          },
        ],
        status: 'idle' as const,
      },
    },
    reducer: {
      auth: authReducer,
      projects: projectsReducer,
      tasks: tasksReducer,
    },
  })

  render(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
      initialEntries={[initialEntry]}
    >
      <ReduxProvider store={store}>
        <I18nProvider>
          <TestHeroUIProvider>
            <Navbar />
          </TestHeroUIProvider>
        </I18nProvider>
      </ReduxProvider>
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    window.localStorage.setItem('proyectos-locale', 'es')
  })

  it('renders logout as icon-only with an accessible label', () => {
    renderNavbar()

    const logoutButtons = screen.getAllByRole('button', {
      name: 'Cerrar sesión',
    })

    expect(logoutButtons.length).toBeGreaterThan(0)
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
    logoutButtons.forEach(button => {
      expect(button).not.toHaveTextContent('Cerrar sesión')
    })
  })

  it('shows capitalized tasks and the task title in detail breadcrumb', () => {
    renderNavbar({
      initialEntry: '/user/3/projects/12/tasks/7',
    })

    const route = screen.getByRole('navigation', { name: 'Ruta' })

    expect(route).toHaveTextContent('Proyectos')
    expect(route).toHaveTextContent('Tareas')
    expect(route).toHaveTextContent('Tarea 3 del PY 1')
    expect(route).not.toHaveTextContent('tareas')
    expect(route).not.toHaveTextContent('tarea')
  })
})
