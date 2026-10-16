import { Suspense, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/auth-store'
import { firstAllowedRoute } from '@/auth/permissions'
import { RequirePermission } from '@/auth/RequirePermission'
import { Skeleton } from '@/components/ui/skeleton'
import type { ModuleId } from '@/types/auth'

export function PageFallback() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

/** Page protégée par module, chargée en différé. */
export function Guarded({ module, children }: { module: ModuleId; children: ReactNode }) {
  return (
    <RequirePermission module={module}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </RequirePermission>
  )
}

export function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={firstAllowedRoute(user)} replace />
}
