import type { RootState } from '@/store'

export function authHeader(getState: () => RootState) {
  const token = getState().auth.token ?? undefined

  return token ? { Authorization: `Bearer ${token}` } : {}
}
