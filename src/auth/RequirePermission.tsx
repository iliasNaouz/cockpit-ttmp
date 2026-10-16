import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AccessDenied } from '@/components/shared/AccessDenied'
import * as api from '@/data/services/api'
import type { ModuleId } from '@/types/auth'
import type { SiteId } from '@/types/domain'
import { useAuth } from './auth-store'
import { canAccessSite } from './permissions'
import { usePermission } from './usePermission'

interface RequirePermissionProps {
  module: ModuleId
  /** Site à contrôler en plus du module (ex. /projets/:siteId). */
  siteId?: SiteId
  children: ReactNode
}

/** Affiche `AccessDenied` si le module ou le site n'est pas autorisé. */
export function RequirePermission({ module, siteId, children }: RequirePermissionProps) {
  const { user } = useAuth()
  const { canRead } = usePermission(module)
  const location = useLocation()
  const siteAllowed = siteId === undefined || canAccessSite(user, siteId)
  const allowed = canRead && siteAllowed

  useEffect(() => {
    if (!allowed && user) void api.recordAccessDenied(user.id, location.pathname, siteId ?? null)
  }, [allowed, user, location.pathname, siteId])

  if (!allowed) return <AccessDenied />
  return <>{children}</>
}
