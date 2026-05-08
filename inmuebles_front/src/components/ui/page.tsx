import type { ReactNode } from 'react'

import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'

interface PageProps {
  children: ReactNode
  className?: string
}

interface PageHeaderProps {
  actions?: ReactNode
  description?: ReactNode
  eyebrow?: string
  title: ReactNode
}

interface EmptyStateProps {
  action?: ReactNode
  description: string
  title: string
}

interface MetricCardProps {
  label: string
  value: ReactNode
}

export function Page({ children, className }: PageProps) {
  return (
    <section className={className ?? 'mx-auto w-full max-w-7xl px-4 py-8'}>
      {children}
    </section>
  )
}

export function PageHeader({
  actions,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-default-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  )
}

export function Toolbar({ children, className }: PageProps) {
  return (
    <div
      className={
        className ??
        'flex flex-col gap-3 rounded-lg border border-default-200 bg-content1 p-3 shadow-sm sm:flex-row sm:items-center'
      }
    >
      {children}
    </div>
  )
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="border border-dashed border-default-200" shadow="none">
      <CardBody className="items-center px-6 py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="text-xl font-semibold">I</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-default-500">
          {description}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </CardBody>
    </Card>
  )
}

export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <Card shadow="none">
      <CardBody className="py-10 text-center text-sm text-default-500">
        {label}
      </CardBody>
    </Card>
  )
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="border border-default-200" shadow="sm">
      <CardBody className="gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-default-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardBody>
    </Card>
  )
}

export function BackButton({
  children,
  onPress,
}: {
  children: ReactNode
  onPress: () => void
}) {
  return (
    <Button color="default" variant="flat" onPress={onPress}>
      {children}
    </Button>
  )
}
