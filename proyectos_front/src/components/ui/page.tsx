import type { ReactNode } from 'react'

import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'

import { useI18n } from '@/i18n/i18n-provider'

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

interface ScrollableListProps {
  children: ReactNode
  className?: string
}

const listingGridClassName = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
const loadingSkeletonItems = [0, 1, 2]

function SkeletonLine({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-default-200/80 dark:bg-default-100/15 ${className}`}
    />
  )
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-default-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export function Toolbar({ children, className }: PageProps) {
  return (
    <div
      className={
        className ??
        'flex flex-col gap-2 rounded-lg border border-default-200 bg-content1 p-2 sm:flex-row sm:items-center'
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

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n()
  const loadingLabel = label ?? t('app.loading')

  return (
    <section aria-label={loadingLabel} className="space-y-4" role="status">
      <span className="sr-only">{loadingLabel}</span>
      <div aria-hidden="true" className={listingGridClassName}>
        {loadingSkeletonItems.map(item => (
          <Card
            key={item}
            className="border border-default-200"
            data-testid="loading-skeleton-card"
            shadow="none"
          >
            <CardBody className="gap-4 p-5">
              <SkeletonLine className="h-5 w-2/3" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-5/6" />
              <div className="flex items-center justify-between pt-3">
                <SkeletonLine className="h-6 w-20" />
                <SkeletonLine className="h-8 w-10" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="border border-default-200" shadow="none">
      <CardBody className="gap-1 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-default-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardBody>
    </Card>
  )
}

export function BackButton({
  children: _children,
  onPress,
}: {
  children: ReactNode
  onPress: () => void
}) {
  const { t } = useI18n()

  return (
    <Button
      isIconOnly
      aria-label={t('common.goBack')}
      color="default"
      size="sm"
      variant="flat"
      onPress={onPress}
    >
      <ArrowLeft aria-hidden="true" size={16} />
    </Button>
  )
}

export function ScrollableList({ children, className }: ScrollableListProps) {
  return (
    <div
      className={className ?? listingGridClassName}
      style={{
        maxHeight: 'min(40rem, 58vh)',
        overflowY: 'auto',
        paddingRight: '0.25rem',
      }}
    >
      {children}
    </div>
  )
}

export function ClearFiltersButton({ onPress }: { onPress: () => void }) {
  const { t } = useI18n()

  return (
    <Button
      isIconOnly
      aria-label={t('common.clearFilters')}
      color="danger"
      size="sm"
      variant="solid"
      onPress={onPress}
    >
      <Trash2 aria-hidden="true" size={16} />
    </Button>
  )
}
