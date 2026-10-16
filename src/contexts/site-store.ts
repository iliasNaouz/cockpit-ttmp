import { createContext, useContext } from 'react'
import type { Site, SiteId } from '@/types/domain'

export interface SiteContextValue {
  siteId: SiteId
  site: Site
  /** Sites que l'utilisateur connecté peut consulter. */
  allowedSites: Site[]
  setSiteId: (siteId: SiteId) => void
}

export const SiteContext = createContext<SiteContextValue | null>(null)

export const SITE_STORAGE_KEY = 'vsd.site'

export function readStoredSite(): string | null {
  try {
    return localStorage.getItem(SITE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function writeStoredSite(siteId: SiteId): void {
  try {
    localStorage.setItem(SITE_STORAGE_KEY, siteId)
  } catch {
    // stockage indisponible : le choix reste en mémoire
  }
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext)
  if (!context) throw new Error('useSite doit être utilisé dans un SiteProvider')
  return context
}
