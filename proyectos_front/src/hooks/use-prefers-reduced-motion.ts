import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const getServerSnapshot = () => false

const getSnapshot = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => undefined
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)

  mediaQuery.addEventListener('change', onStoreChange)

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange)
  }
}

export const usePrefersReducedMotion = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
