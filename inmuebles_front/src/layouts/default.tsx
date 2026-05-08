import { Navbar } from '@/components/navbar'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#f4fbf8_100%)] text-foreground dark:bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
