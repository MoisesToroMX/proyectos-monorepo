import type { ReactNode } from 'react'

import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import AppRouter from '@/components/AppRouter'
import { useI18n } from '@/i18n/i18n-provider'

const LoginPage = lazy(() => import('@/pages/login'))
const RegisterPage = lazy(() => import('@/pages/register'))
const UserRoutes = lazy(() =>
  import('./UserRoutes').then(module => ({ default: module.UserRoutes }))
)

function RouteFallback() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-default-500">
      {t('app.loading')}
    </div>
  )
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route
        element={
          <LazyRoute>
            <LoginPage />
          </LazyRoute>
        }
        path="/login"
      />
      <Route
        element={
          <LazyRoute>
            <RegisterPage />
          </LazyRoute>
        }
        path="/register"
      />
      <Route
        element={
          <AppRouter>
            <LazyRoute>
              <UserRoutes />
            </LazyRoute>
          </AppRouter>
        }
        path="/user/*"
      />
      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  )
}
