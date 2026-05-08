import type { FC } from 'react'
import type { SwitchProps } from '@heroui/switch'

import { VisuallyHidden } from '@react-aria/visually-hidden'
import { useSwitch } from '@heroui/switch'
import clsx from 'clsx'
import { useTheme } from '@heroui/use-theme'

import { SunFilledIcon, MoonFilledIcon } from '@/components/icons'
import { useI18n } from '@/i18n/i18n-provider'

interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { t } = useI18n()
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: isLight,
    onChange: () => setTheme(isLight ? 'dark' : 'light'),
  })

  return (
    <Component
      aria-label={isSelected ? t('theme.toDark') : t('theme.toLight')}
      {...getBaseProps({
        className: clsx(
          'px-px transition-opacity hover:opacity-80 cursor-pointer',
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              'w-auto h-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'pointer-events-none',
              'group-data-[selected=true]:bg-transparent',
              '!text-default-500',
              'pt-px',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper
          ),
        })}
      >
        {isSelected ? (
          <MoonFilledIcon size={22} />
        ) : (
          <SunFilledIcon size={22} />
        )}
      </div>
    </Component>
  )
}
