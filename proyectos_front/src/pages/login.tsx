import type { FormEvent } from 'react'

import { useEffect, useState } from 'react'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'
import { Input } from '@heroui/input'

import { AuthPanel } from '@/components/auth/auth-panel'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loginUser,
  selectAuthToken,
  selectCurrentUser,
} from '@/store/slices/authSlice'
import { getErrorMessage } from '@/utils/errors'
import { useI18n } from '@/i18n/i18n-provider'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const token = useAppSelector(selectAuthToken)
  const user = useAppSelector(selectCurrentUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token && user) {
      navigate(`/user/${user.id}/projects`, { replace: true })
    }
  }, [token, user, navigate])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await dispatch(
        loginUser({
          email: email.trim(),
          password,
        })
      ).unwrap()

      navigate(`/user/${result.user.id}/projects`, { replace: true })
    } catch (error) {
      setError(getErrorMessage(error, t('error.login')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPanel
      footerHref="/register"
      footerLabel={t('auth.loginFooterLabel')}
      footerText={t('auth.loginFooterText')}
      subtitle={t('auth.loginSubtitle')}
      title={t('auth.loginTitle')}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          isRequired
          autoComplete="email"
          className="w-full"
          label={t('field.email')}
          size="sm"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <Input
          isRequired
          autoComplete="current-password"
          className="w-full"
          label={t('field.password')}
          size="sm"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        {error && <p className="text-danger text-sm text-center">{error}</p>}
        <Button
          fullWidth
          className="mt-6"
          color="primary"
          isLoading={loading}
          size="sm"
          type="submit"
        >
          {t('auth.loginButton')}
        </Button>
      </form>
    </AuthPanel>
  )
}
