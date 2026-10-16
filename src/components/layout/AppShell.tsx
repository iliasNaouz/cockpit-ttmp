import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { useSidebar } from '@/contexts/sidebar-store'
import { PAGE_CONTAINER } from '@/design-system/tokens'
import { cn } from '@/lib/utils'
import { MobileNav } from './MobileNav'
import { PageHeader } from './PageHeader'
import { Sidebar } from './Sidebar'

/** Pages qui gèrent elles-mêmes leur en-tête et leur hauteur. */
function getLayoutMode(pathname: string): 'chat' | 'dashboard' | 'standard' {
  if (pathname.startsWith('/chat')) return 'chat'
  if (pathname.startsWith('/ttmp')) return 'dashboard'
  return 'standard'
}

function ShellLayout() {
  const { pathname } = useLocation()
  const { collapsed } = useSidebar()
  const mode = getLayoutMode(pathname)

  return (
    <div className="min-h-dvh bg-page">
      <Sidebar />
      <div className={cn('flex min-h-dvh flex-col transition-[padding] duration-200 ease-out', collapsed ? 'md:pl-[68px]' : 'md:pl-60')}>
        <MobileNav />
        {mode === 'chat' && (
          <main className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-1 flex-col md:h-dvh">
            <Outlet />
          </main>
        )}
        {mode === 'dashboard' && (
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        )}
        {mode === 'standard' && (
          <main className={cn(PAGE_CONTAINER, 'min-w-0 flex-1 space-y-4')}>
            <PageHeader />
            <Outlet />
          </main>
        )}
      </div>
    </div>
  )
}

/** Layout commun : sidebar rétractable, en-tête de page, contenu. */
export function AppShell() {
  return (
    <SidebarProvider>
      <ShellLayout />
    </SidebarProvider>
  )
}
