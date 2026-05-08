import type { FormEvent } from 'react'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'

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
  return (
    <Card className="border border-default-200" shadow="sm">
      <CardBody>
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            label="Título de la tarea"
            value={title}
            onChange={event => onTitleChange(event.target.value)}
          />
          <Input
            isRequired
            label="Descripción"
            value={description}
            onChange={event => onDescriptionChange(event.target.value)}
          />
          <Button
            className="h-14 px-6"
            color="primary"
            isLoading={isCreating}
            type="submit"
          >
            Crear tarea
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
