import type { Locale } from '@/i18n/messages'

import { Button } from '@heroui/button'

import { useI18n } from '@/i18n/i18n-provider'

const LOCALES: Array<{ key: Locale; label: string }> = [
  { key: 'es', label: 'ES' },
  { key: 'en', label: 'EN' },
]

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      aria-label={t('language.label')}
      className="flex rounded-full border border-default-200 bg-content2 p-0.5"
      role="group"
    >
      {LOCALES.map(option => (
        <Button
          key={option.key}
          aria-pressed={locale === option.key}
          className="h-8 min-w-9 px-2 text-xs font-semibold"
          color={locale === option.key ? 'primary' : 'default'}
          radius="full"
          size="sm"
          variant={locale === option.key ? 'solid' : 'light'}
          onPress={() => setLocale(option.key)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
