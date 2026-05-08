import type { FormEvent } from 'react'

import { useEffect, useState } from 'react'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'
import { Input } from '@heroui/input'

import { AuthPanel } from '@/components/auth/auth-panel'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/authSlice'
import { getErrorMessage } from '@/utils/errors'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, user } = useAppSelector(state => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)

      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)

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
      setError(getErrorMessage(error, 'Error al registrarse'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPanel
      footerHref="/login"
      footerLabel="Inicia sesión"
      footerText="¿Ya tienes cuenta?"
      subtitle="Crea tu acceso para administrar inmuebles y tareas."
      title="Crea tu cuenta"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          isRequired
          autoComplete="name"
          className="w-full"
          label="Nombre completo"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Input
          isRequired
          autoComplete="email"
          className="w-full"
          label="Email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <Input
          isRequired
          autoComplete="new-password"
          className="w-full"
          label="Contraseña"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Input
          isRequired
          autoComplete="new-password"
          className="w-full"
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
        />
        {error && <p className="text-danger text-sm text-center">{error}</p>}
        <Button
          fullWidth
          className="mt-6"
          color="primary"
          isLoading={loading}
          type="submit"
        >
          Registrarse
        </Button>
      </form>
    </AuthPanel>
  )
}
