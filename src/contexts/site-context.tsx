import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '@/auth/auth-store'
import { getAllowedSites } from '@/auth/permissions'
import { SITES, isSiteId } from '@/lib/sites'
import type { SiteId } from '@/types/domain'
import {
  SiteContext,
  readStoredSite,
  writeStoredSite,
  type SiteContextValue,
} from './site-store'

export function SiteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [stored, setStored] = useState<string | null>(() => readStoredSite())

  const allowedIds = useMemo(() => getAllowedSites(user), [user])

  // Le site stocké n'est retenu que s'il est autorisé pour l'utilisateur courant.
  const siteId: SiteId = isSiteId(stored) && allowedIds.includes(stored) ? stored : (allowedIds[0] ?? 'begles')

  const setSiteId = useCallback((next: SiteId) => {
    writeStoredSite(next)
    setStored(next)
  }, [])

  const value = useMemo<SiteContextValue>(
    () => ({
      siteId,
      site: SITES[siteId],
      allowedSites: allowedIds.map((id) => SITES[id]),
      setSiteId,
    }),
    [siteId, allowedIds, setSiteId],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
