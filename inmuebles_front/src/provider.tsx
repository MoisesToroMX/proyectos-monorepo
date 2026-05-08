import type { NavigateOptions } from 'react-router-dom'

import { useEffect } from 'react'
import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Provider as ReduxProvider } from 'react-redux'

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { store } from '@/store'
import { logoutAndClear } from '@/store/slices/authSlice'
import { attachAuthInterceptor } from '@/store/api'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const shouldReduceMotion = usePrefersReducedMotion()
  const reducedMotion = shouldReduceMotion ? 'always' : 'never'

  useEffect(() => {
    const detach = attachAuthInterceptor(() => {
      store.dispatch(logoutAndClear())
      navigate('/login', { replace: true })
    })

    return detach
  }, [navigate])

  return (
    <ReduxProvider store={store}>
      <MotionConfig reducedMotion={reducedMotion}>
        <HeroUIProvider navigate={navigate} useHref={useHref}>
          {children}
        </HeroUIProvider>
      </MotionConfig>
    </ReduxProvider>
  )
}
