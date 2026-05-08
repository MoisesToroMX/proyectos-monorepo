import { AxiosError } from 'axios'

interface ApiErrorBody {
  detail?: string
  message?: string
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined

    return data?.detail ?? data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error) return error.message

  return fallback
}
