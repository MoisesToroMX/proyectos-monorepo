const AUTH_SESSION_KEY = 'proyectos_auth_session'
const LEGACY_AUTH_TOKEN_KEY = 'auth_token'
const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000

interface StoredAuthSession {
  expiresAt: number
  token: string
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function buildSession(token: string): StoredAuthSession {
  return {
    expiresAt: Date.now() + TOKEN_MAX_AGE_MS,
    token,
  }
}

function clearStoredToken() {
  window.localStorage.removeItem(AUTH_SESSION_KEY)
  window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY)
}

function parseStoredSession(value: string | null) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as Partial<StoredAuthSession>

    if (typeof parsed.token !== 'string') return null
    if (typeof parsed.expiresAt !== 'number') return null

    return parsed as StoredAuthSession
  } catch {
    return null
  }
}

function migrateLegacyToken() {
  const legacyToken = window.localStorage.getItem(LEGACY_AUTH_TOKEN_KEY)

  if (!legacyToken) return null

  const session = buildSession(legacyToken)

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY)

  return session
}

export function readAuthToken() {
  if (!canUseStorage()) return null

  try {
    const session =
      parseStoredSession(window.localStorage.getItem(AUTH_SESSION_KEY)) ??
      migrateLegacyToken()

    if (!session) return null

    if (session.expiresAt <= Date.now()) {
      clearStoredToken()

      return null
    }

    return session.token
  } catch {
    return null
  }
}

export function persistAuthToken(token: string | null) {
  if (!canUseStorage()) return

  try {
    if (token) {
      window.localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify(buildSession(token))
      )
      window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY)

      return
    }

    clearStoredToken()
  } catch {
    return
  }
}
