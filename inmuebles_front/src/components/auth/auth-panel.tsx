import type { ReactNode } from 'react'

import { Card, CardBody } from '@heroui/card'
import { Link } from 'react-router-dom'

import { BrandMark } from '@/components/ui/brand'

interface AuthPanelProps {
  children: ReactNode
  footerHref: string
  footerLabel: string
  footerText: string
  subtitle: string
  title: string
}

export function AuthPanel({
  children,
  footerHref,
  footerLabel,
  footerText,
  subtitle,
  title,
}: AuthPanelProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,111,238,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef6f3_48%,_#ffffff_100%)] px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <section className="hidden lg:block">
            <BrandMark />
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-tight">
              Control claro para cada inmueble, tarea y seguimiento.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-default-600">
              Organiza propiedades, da seguimiento operativo y mantén el trabajo
              visible sin pantallas saturadas.
            </p>
          </section>

          <Card className="border border-default-200 shadow-xl" radius="lg">
            <CardBody className="gap-6 p-6 sm:p-8">
              <div>
                <div className="mb-6 lg:hidden">
                  <BrandMark />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-default-500">
                  {subtitle}
                </p>
              </div>

              {children}

              <p className="text-center text-sm text-default-500">
                {footerText}{' '}
                <Link
                  className="font-medium text-primary hover:underline"
                  to={footerHref}
                >
                  {footerLabel}
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  )
}
