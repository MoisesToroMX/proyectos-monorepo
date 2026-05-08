const AUTH_TOKEN_KEY = 'auth_token'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function readAuthToken() {
  if (!canUseStorage()) return null

  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function persistAuthToken(token: string | null) {
  if (!canUseStorage()) return

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token)

      return
    }

    window.localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    return
  }
}
