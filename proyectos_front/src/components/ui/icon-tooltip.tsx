import type { ReactNode } from 'react'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface IconTooltipProps {
  children: ReactNode
  label: string
}

interface TooltipPosition {
  left: number
  top: number
}

export function IconTooltip({ children, label }: IconTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [position, setPosition] = useState<TooltipPosition | null>(null)

  const showTooltip = () => {
    const trigger = triggerRef.current

    if (!trigger) return

    const rect = trigger.getBoundingClientRect()

    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
    })
  }

  const hideTooltip = () => setPosition(null)

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onBlur={hideTooltip}
      onFocus={showTooltip}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {position &&
        createPortal(
          <span
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg"
            role="tooltip"
            style={{
              left: position.left,
              top: position.top,
            }}
          >
            {label}
          </span>,
          document.body
        )}
    </span>
  )
}
