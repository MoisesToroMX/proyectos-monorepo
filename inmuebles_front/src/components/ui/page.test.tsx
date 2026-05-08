import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ClearFiltersButton, ScrollableList } from '@/components/ui/page'
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
  })

  it('uses an icon-only red clear filter action', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()

    renderWithProviders(<ClearFiltersButton onPress={onPress} />)

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
