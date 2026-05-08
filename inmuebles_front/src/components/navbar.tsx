import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar'
import { link as linkStyles } from '@heroui/theme'
import clsx from 'clsx'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logoutAndClear } from '@/store/slices/authSlice'
import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandMark } from '@/components/ui/brand'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { token, user } = useAppSelector(state => state.auth)
  const resolvedUserId = userId ?? (user ? String(user.id) : undefined)
  const projectsHref = resolvedUserId
    ? `/user/${resolvedUserId}/projects`
    : '/login'
  const navItems = siteConfig.navItems.map(item => ({
    ...item,
    href: item.href === '/projects' ? projectsHref : item.href,
  }))

  const handleLogout = () => {
    dispatch(logoutAndClear())
    navigate('/login', { replace: true })
  }

  return (
    <HeroUINavbar
      className="border-b border-default-200/70 bg-background/80 backdrop-blur"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link color="foreground" href={projectsHref}>
            <BrandMark />
          </Link>
        </NavbarBrand>
        <div className="hidden gap-4 lg:flex">
          {navItems.map(item => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                data-active={location.pathname.startsWith(item.href)}
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          {token ? (
            <Button
              className="text-sm font-normal"
              color="danger"
              variant="flat"
              onPress={handleLogout}
            >
              Cerrar sesión
            </Button>
          ) : (
            <Button as={Link} color="primary" href="/login" variant="flat">
              Entrar
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {token && (
          <Button
            className="text-xs"
            color="danger"
            size="sm"
            variant="flat"
            onPress={handleLogout}
          >
            Salir
          </Button>
        )}
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map(item => (
            <NavbarMenuItem key={item.href}>
              <Link color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}
