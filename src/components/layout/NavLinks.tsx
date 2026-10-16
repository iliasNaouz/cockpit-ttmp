import { Lock } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/auth-store'
import { MODULES } from '@/auth/modules'
import { can, getVisibleModules } from '@/auth/permissions'
import { MODULE_ICONS } from '@/components/shared/module-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NavLinksProps {
  collapsed: boolean
  onNavigate?: () => void
}

/** Liens de navigation : seulement les modules autorisés, cadenas si lecture seule. */
export function NavLinks({ collapsed, onNavigate }: NavLinksProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navigation principale">
      <h2 className={cn('text-lg font-bold text-ink', collapsed && 'sr-only')}>Navigation</h2>
      <ul className={cn('space-y-1', !collapsed && 'mt-3')}>
        {getVisibleModules(user).map((moduleId) => {
          const meta = MODULES[moduleId]
          const Icon = MODULE_ICONS[moduleId]
          const readOnly = !can(user, moduleId, 'ecriture')
          const active = pathname === meta.route || pathname.startsWith(`${meta.route}/`)

          const linkProps = {
            to: meta.route,
            onClick: onNavigate,
            'aria-current': active ? ('page' as const) : undefined,
            className: cn(
              'flex items-center rounded-lg text-sm text-ink-body transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand',
              collapsed ? 'mx-auto size-10 justify-center' : 'h-9 gap-2.5 px-3',
              active && 'bg-brand-soft font-semibold text-brand hover:bg-brand-soft',
            ),
          }
          const content = (
            <>
              <Icon className={cn(collapsed ? 'size-[18px]' : 'size-4', active ? 'text-brand' : 'text-ink-sub')} aria-hidden />
              <span className={cn('flex-1 whitespace-nowrap transition-opacity duration-150', collapsed && 'sr-only')}>
                {meta.navLabel}
              </span>
              {readOnly && <Lock className={cn('size-3 text-ink-mute', collapsed && 'sr-only')} aria-label="Lecture seule" />}
            </>
          )

          return (
            <li key={moduleId}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger render={<Link {...linkProps} />}>{content}</TooltipTrigger>
                  <TooltipContent side="right">
                    {meta.navLabel}
                    {readOnly && <span className="text-surface/70"> · lecture seule</span>}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link {...linkProps}>{content}</Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
