import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/contexts/sidebar-store'
import { cn } from '@/lib/utils'
import { Logo, LogoMark } from './Logo'
import { NavLinks } from './NavLinks'
import { SidebarToggle } from './SidebarToggle'
import { SiteSelector } from './SiteSelector'
import { UserMenu } from './UserMenu'

interface SidebarContentProps {
  /** Mode icônes seules (sidebar fixe réduite). Toujours faux dans le Sheet mobile. */
  collapsed?: boolean
  onNavigate?: () => void
  /** Affiche le bouton de bascule (sidebar fixe uniquement). */
  withToggle?: boolean
}

/** Contenu de la sidebar, partagé entre la version fixe et le Sheet mobile. */
export function SidebarContent({ collapsed = false, onNavigate, withToggle = false }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface">
      <div className={cn('flex shrink-0 p-5', collapsed ? 'flex-col items-center gap-2 px-0 py-4' : 'items-center justify-between')}>
        {collapsed ? (
          <LogoMark />
        ) : (
          <Logo />
        )}
        {withToggle && <SidebarToggle />}
      </div>
      <div className={cn('flex-1 space-y-4 overflow-y-auto overflow-x-hidden pb-4', collapsed ? 'px-3' : 'px-5')}>
        <SiteSelector collapsed={collapsed} />
        {!collapsed && <Separator />}
        <NavLinks collapsed={collapsed} onNavigate={onNavigate} />
      </div>
      <div className="shrink-0 border-t border-line p-3">
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
  )
}

/** Sidebar fixe (≥ 768px) : 240px déployée, 68px réduite, transition de largeur 200ms. */
export function Sidebar() {
  const { collapsed } = useSidebar()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden border-r border-line transition-[width] duration-200 ease-out md:block',
        collapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      <SidebarContent collapsed={collapsed} withToggle />
    </aside>
  )
}
