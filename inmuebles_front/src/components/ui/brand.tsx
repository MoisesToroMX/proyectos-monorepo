import { Logo } from '@/components/icons'
import { siteConfig } from '@/config/site'

export function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
        <Logo className="size-5" />
      </span>
      <span className="font-bold tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </div>
  )
}
