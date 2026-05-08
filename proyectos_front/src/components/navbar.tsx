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
import { ChevronRight, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  logoutAndClear,
  selectAuthToken,
  selectCurrentUser,
} from '@/store/slices/authSlice'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandMark } from '@/components/ui/brand'
import { LanguageSwitch } from '@/components/language-switch'
import { useI18n } from '@/i18n/i18n-provider'
import { selectTaskById } from '@/store/slices/tasksSlice'

interface RouteTrailItem {
  href?: string
  label: string
}

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const pathMatch = location.pathname.match(
    /^\/user\/([^/]+)(?:\/projects(?:\/([^/]+)(?:\/tasks(?:\/([^/]+))?)?)?)?/
  )
  const userId = pathMatch?.[1]
  const projectId = pathMatch?.[2]
  const taskId = pathMatch?.[3]
  const token = useAppSelector(selectAuthToken)
  const user = useAppSelector(selectCurrentUser)
  const currentTask = useAppSelector(state =>
    selectTaskById(state, Number(taskId))
  )
  const resolvedUserId = userId ?? (user ? String(user.id) : undefined)
  const projectsHref = resolvedUserId
    ? `/user/${resolvedUserId}/projects`
    : '/login'
  const tasksHref =
    resolvedUserId && projectId
      ? `/user/${resolvedUserId}/projects/${projectId}/tasks`
      : undefined
  const routeItems: RouteTrailItem[] = [
    { href: projectsHref, label: t('route.properties') },
  ]

  if (projectId) {
    routeItems.push({ href: tasksHref, label: t('route.tasks') })
  }

  if (taskId) {
    routeItems.push({ label: currentTask?.title ?? t('route.task') })
  }

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
        <nav
          aria-label={t('nav.route')}
          className="hidden min-w-0 items-center gap-1 text-sm lg:flex"
        >
          {routeItems.map((item, index) => (
            <div
              key={item.href ?? item.label}
              className="flex items-center gap-1"
            >
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="text-default-400"
                  size={14}
                />
              )}
              {item.href && index < routeItems.length - 1 ? (
                <Link className="font-medium text-primary" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    location.pathname === item.href
                      ? 'font-semibold text-foreground'
                      : 'font-medium text-default-600'
                  }
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <LanguageSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          {token ? (
            <Button
              isIconOnly
              aria-label={t('nav.logout')}
              className="h-9 min-w-9 px-0"
              color="danger"
              size="sm"
              variant="solid"
              onPress={handleLogout}
            >
              <LogOut aria-hidden="true" size={16} />
            </Button>
          ) : (
            <Button
              as={Link}
              color="primary"
              href="/login"
              size="sm"
              variant="solid"
            >
              {t('nav.login')}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 gap-2 pl-2" justify="end">
        <LanguageSwitch />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {routeItems.map(item => (
            <NavbarMenuItem key={`${item.href}-${item.label}`}>
              <Link color="foreground" href={item.href ?? '#'} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {token && (
            <NavbarMenuItem>
              <Button
                isIconOnly
                aria-label={t('nav.logout')}
                className="h-9 min-w-9 px-0"
                color="danger"
                size="sm"
                variant="solid"
                onPress={handleLogout}
              >
                <LogOut aria-hidden="true" size={16} />
              </Button>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}
