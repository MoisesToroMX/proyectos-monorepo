import { Button } from '@heroui/button'

interface ConfirmDeleteButtonProps {
  confirmMessage: string
  isDisabled?: boolean
  label?: string
  onConfirm: () => void | Promise<void>
}

export function ConfirmDeleteButton({
  confirmMessage,
  isDisabled,
  label = 'Eliminar',
  onConfirm,
}: ConfirmDeleteButtonProps) {
  const handlePress = async () => {
    if (!window.confirm(confirmMessage)) return

    await onConfirm()
  }

  return (
    <Button
      color="danger"
      isDisabled={isDisabled}
      size="sm"
      variant="flat"
      onPress={handlePress}
    >
      {label}
    </Button>
  )
}
