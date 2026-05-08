import { Button } from '@heroui/button'
import { Trash2 } from 'lucide-react'

import { useI18n } from '@/i18n/i18n-provider'

interface ConfirmDeleteButtonProps {
  ariaLabel?: string
  confirmMessage: string
  isDisabled?: boolean
  label?: string
  onConfirm: () => void | Promise<void>
  showLabel?: boolean
}

export function ConfirmDeleteButton({
  ariaLabel,
  confirmMessage,
  isDisabled,
  label,
  onConfirm,
  showLabel = false,
}: ConfirmDeleteButtonProps) {
  const { t } = useI18n()
  const accessibleLabel = ariaLabel ?? label ?? t('common.delete')

  const handlePress = async () => {
    if (!window.confirm(confirmMessage)) return

    await onConfirm()
  }

  return (
    <Button
      aria-label={accessibleLabel}
      color="danger"
      isDisabled={isDisabled}
      isIconOnly={!showLabel}
      size="sm"
      startContent={showLabel ? <Trash2 aria-hidden="true" size={16} /> : null}
      variant="solid"
      onClick={event => event.stopPropagation()}
      onPress={handlePress}
    >
      {showLabel ? accessibleLabel : <Trash2 aria-hidden="true" size={16} />}
    </Button>
  )
}
