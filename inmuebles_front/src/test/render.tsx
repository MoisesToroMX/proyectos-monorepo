import type { ReactElement, ReactNode } from 'react'

import { HeroUIProvider } from '@heroui/system'
import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter, useHref, useNavigate } from 'react-router-dom'

import { I18nProvider } from '@/i18n/i18n-provider'

function TestHeroUIProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <I18nProvider>
          <TestHeroUIProvider>{children}</TestHeroUIProvider>
        </I18nProvider>
      </MemoryRouter>
    ),
    ...options,
  })
}
