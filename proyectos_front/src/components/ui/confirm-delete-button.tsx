import { Button } from '@heroui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { IconTooltip } from '@/components/ui/icon-tooltip'
import { useI18n } from '@/i18n/i18n-provider'

interface ConfirmDeleteButtonProps {
  ariaLabel?: string
  className?: string
  confirmMessage?: string
  isDisabled?: boolean
  label?: string
  modalTitle?: string
  onConfirm: () => void | Promise<void>
  showLabel?: boolean
}

export function ConfirmDeleteButton({
  ariaLabel,
  className,
  confirmMessage,
  isDisabled,
  label,
  modalTitle,
  onConfirm,
  showLabel = false,
}: ConfirmDeleteButtonProps) {
  const { t } = useI18n()
  const accessibleLabel = ariaLabel ?? label ?? t('common.delete')
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handlePress = async () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    if (isConfirming) return

    setIsOpen(false)
  }

  const handleConfirm = async () => {
    setIsConfirming(true)

    try {
      await onConfirm()
      setIsOpen(false)
    } finally {
      setIsConfirming(false)
    }
  }

  const button = (
    <Button
      aria-label={accessibleLabel}
      className={className}
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

  return (
    <>
      {showLabel ? (
        button
      ) : (
        <IconTooltip label={accessibleLabel}>{button}</IconTooltip>
      )}

      {isOpen &&
        createPortal(
          <div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
          >
            <div className="w-full max-w-sm rounded-lg border border-default-200 bg-background p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-foreground">
                {modalTitle ?? accessibleLabel}
              </h2>
              {confirmMessage && (
                <p className="mt-2 text-sm text-default-600">
                  {confirmMessage}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <Button size="sm" variant="flat" onPress={handleCancel}>
                  {t('common.cancel')}
                </Button>
                <Button
                  color="danger"
                  isLoading={isConfirming}
                  size="sm"
                  variant="solid"
                  onPress={handleConfirm}
                >
                  {accessibleLabel}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
