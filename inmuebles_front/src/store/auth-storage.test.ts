import { beforeEach, describe, expect, it, vi } from 'vitest'

import { persistAuthToken, readAuthToken } from '@/store/auth-storage'

const SESSION_KEY = 'proyectos_auth_session'
const LEGACY_KEY = 'auth_token'
const TWO_HOURS_MS = 2 * 60 * 60 * 1000

describe('auth-storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-08T08:00:00Z'))
  })

  it('persists tokens with a two hour client-side maximum lifetime', () => {
    persistAuthToken('jwt-token')

    const stored = window.localStorage.getItem(SESSION_KEY)
    const session = JSON.parse(stored ?? '{}') as {
      expiresAt: number
      token: string
    }

    expect(readAuthToken()).toBe('jwt-token')
    expect(session.token).toBe('jwt-token')
    expect(session.expiresAt - Date.now()).toBe(TWO_HOURS_MS)
  })

  it('clears expired tokens instead of reusing them', () => {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        expiresAt: Date.now() - 1,
        token: 'expired-token',
      })
    )

    expect(readAuthToken()).toBeNull()
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull()
  })

  it('migrates legacy tokens into expiring sessions', () => {
    window.localStorage.setItem(LEGACY_KEY, 'legacy-token')

    expect(readAuthToken()).toBe('legacy-token')
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull()
    expect(window.localStorage.getItem(SESSION_KEY)).toContain('legacy-token')
  })
})
