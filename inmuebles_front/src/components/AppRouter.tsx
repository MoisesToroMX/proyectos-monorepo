import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setUser, logoutAndClear } from '@/store/slices/authSlice'
import { api } from '@/store/api'
import DefaultLayout from '@/layouts/default'
import { LoadingState, Page } from '@/components/ui/page'
import { useI18n } from '@/i18n/i18n-provider'

interface AppRouterProps {
  children: React.ReactNode
}

export default function AppRouter({ children }: AppRouterProps) {
  const { token, user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const location = useLocation()
  const routeUserId = location.pathname.match(/^\/user\/([^/]+)/)?.[1]

  useEffect(() => {
    if (token && !user) {
      api
        .get('/auth/me')
        .then(({ data }) => {
          dispatch(setUser(data))
        })
        .catch(() => {
          dispatch(logoutAndClear())
        })
    }
  }, [token, user, dispatch])

  if (!token) {
    return <Navigate replace to="/login" />
  }

  if (token && !user) {
    return (
      <DefaultLayout>
        <Page>
          <LoadingState label={t('app.sessionLoading')} />
        </Page>
      </DefaultLayout>
    )
  }

  if (token && user && !location.pathname.startsWith('/user/')) {
    return <Navigate replace to={`/user/${user.id}/projects`} />
  }

  if (token && user && routeUserId !== String(user.id)) {
    return <Navigate replace to={`/user/${user.id}/projects`} />
  }

  return <DefaultLayout>{children}</DefaultLayout>
}
