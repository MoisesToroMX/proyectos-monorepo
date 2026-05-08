import type { ReactNode } from 'react'

import { Navbar } from '@/components/navbar'

const layoutClassName = [
  'min-h-screen text-foreground',
  'bg-[radial-gradient(circle_at_top_left,_rgba(0,111,238,0.11),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#f4fbf8_100%)]',
  'dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,111,238,0.18),_transparent_34%),linear-gradient(180deg,_#09090b_0%,_#111827_54%,_#0f172a_100%)]',
].join(' ')

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className={layoutClassName}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
