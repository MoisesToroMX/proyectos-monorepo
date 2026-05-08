import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ClearFiltersButton,
  LoadingState,
  ScrollableList,
} from '@/components/ui/page'
import { renderWithProviders } from '@/test/render'

describe('page UI helpers', () => {
  beforeEach(() => {
    window.localStorage.setItem('inmuebles-locale', 'es')
  })

  it('renders scrollable listings with a vertical max height', () => {
    renderWithProviders(
      <ScrollableList>
        <div>Inmueble 1</div>
      </ScrollableList>
    )

    const list = screen.getByText('Inmueble 1').parentElement

    expect(list).toHaveStyle({
      maxHeight: 'min(40rem, 58vh)',
      overflowY: 'auto',
    })
    expect(list).toHaveClass(
      'grid',
      'gap-4',
      'md:grid-cols-2',
      'xl:grid-cols-3'
    )
  })

  it('uses an icon-only red clear filter action', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()

    renderWithProviders(<ClearFiltersButton onPress={onPress} />)

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders loading skeletons with an accessible status label', () => {
    renderWithProviders(<LoadingState label="Cargando inmuebles" />)

    expect(
      screen.getByRole('status', { name: 'Cargando inmuebles' })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('loading-skeleton-card')).toHaveLength(3)
  })
})
