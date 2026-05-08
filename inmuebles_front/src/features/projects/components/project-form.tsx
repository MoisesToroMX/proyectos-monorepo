import type { FormEvent } from 'react'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'

import { useI18n } from '@/i18n/i18n-provider'

interface ProjectFormProps {
  description: string
  isCreating: boolean
  name: string
  onDescriptionChange: (value: string) => void
  onNameChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ProjectForm({
  description,
  isCreating,
  name,
  onDescriptionChange,
  onNameChange,
  onSubmit,
}: ProjectFormProps) {
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
            label={t('projects.name')}
            size="sm"
            value={name}
            onChange={event => onNameChange(event.target.value)}
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
            {t('projects.create')}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
