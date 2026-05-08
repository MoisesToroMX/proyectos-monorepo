import type { FormEvent } from 'react'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'

import { useI18n } from '@/i18n/i18n-provider'

interface TaskFormProps {
  description: string
  isCreating: boolean
  onDescriptionChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTitleChange: (value: string) => void
  title: string
}

export function TaskForm({
  description,
  isCreating,
  onDescriptionChange,
  onSubmit,
  onTitleChange,
  title,
}: TaskFormProps) {
  const { t } = useI18n()

  return (
    <Card className="border border-default-200" shadow="none">
      <CardBody className="p-3">
        <form
          className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            label={t('tasks.title')}
            size="sm"
            value={title}
            onChange={event => onTitleChange(event.target.value)}
          />
          <Input
            isRequired
            label={t('field.description')}
            size="sm"
            value={description}
            onChange={event => onDescriptionChange(event.target.value)}
          />
          <Button
            className="h-10 px-5"
            color="primary"
            isLoading={isCreating}
            size="sm"
            type="submit"
          >
            {t('tasks.create')}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
