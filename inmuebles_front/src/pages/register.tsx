import type { FormEvent } from 'react'

import { useEffect, useReducer } from 'react'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'
import { Input } from '@heroui/input'

import { AuthPanel } from '@/components/auth/auth-panel'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/authSlice'
import { getErrorMessage } from '@/utils/errors'
import { useI18n } from '@/i18n/i18n-provider'

interface RegisterState {
  confirmPassword: string
  email: string
  error: string | null
  loading: boolean
  name: string
  password: string
}

const initialRegisterState: RegisterState = {
  confirmPassword: '',
  email: '',
  error: null,
  loading: false,
  name: '',
  password: '',
}

function mergeRegisterState(
  state: RegisterState,
  patch: Partial<RegisterState>
) {
  return { ...state, ...patch }
}

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { token, user } = useAppSelector(state => state.auth)
  const [formState, setFormState] = useReducer(
    mergeRegisterState,
    initialRegisterState
  )
  const { confirmPassword, email, error, loading, name, password } = formState

  useEffect(() => {
    if (token && user) {
      navigate(`/user/${user.id}/projects`, { replace: true })
    }
  }, [token, user, navigate])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState({ error: null, loading: true })

    if (password !== confirmPassword) {
      setFormState({
        error: t('error.passwordMismatch'),
        loading: false,
      })

      return
    }

    if (password.length < 6) {
      setFormState({
        error: t('error.passwordMin'),
        loading: false,
      })

      return
    }

    try {
      await dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      ).unwrap()
      navigate('/login', { replace: true })
    } catch (error) {
      setFormState({ error: getErrorMessage(error, t('error.register')) })
    } finally {
      setFormState({ loading: false })
    }
  }

  return (
    <AuthPanel
      footerHref="/login"
      footerLabel={t('auth.registerFooterLabel')}
      footerText={t('auth.registerFooterText')}
      subtitle={t('auth.registerSubtitle')}
      title={t('auth.registerTitle')}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          isRequired
          autoComplete="name"
          className="w-full"
          label={t('field.fullName')}
          size="sm"
          value={name}
          onChange={event => setFormState({ name: event.target.value })}
        />
        <Input
          isRequired
          autoComplete="email"
          className="w-full"
          label={t('field.email')}
          size="sm"
          type="email"
          value={email}
          onChange={event => setFormState({ email: event.target.value })}
        />
        <Input
          isRequired
          autoComplete="new-password"
          className="w-full"
          label={t('field.password')}
          size="sm"
          type="password"
          value={password}
          onChange={event => setFormState({ password: event.target.value })}
        />
        <Input
          isRequired
          autoComplete="new-password"
          className="w-full"
          label={t('field.confirmPassword')}
          size="sm"
          type="password"
          value={confirmPassword}
          onChange={event =>
            setFormState({ confirmPassword: event.target.value })
          }
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
          {t('auth.registerButton')}
        </Button>
      </form>
    </AuthPanel>
  )
}
