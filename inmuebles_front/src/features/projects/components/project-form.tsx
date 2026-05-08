import type { FormEvent } from 'react'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'

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
  return (
    <Card className="border border-default-200" shadow="sm">
      <CardBody>
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            label="Nombre del inmueble"
            value={name}
            onChange={event => onNameChange(event.target.value)}
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
            Crear inmueble
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
