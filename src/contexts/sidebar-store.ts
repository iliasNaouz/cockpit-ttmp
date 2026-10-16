import { createContext, useContext } from 'react'

export interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export const SIDEBAR_KEY = 'vsd.sidebar'
/** Sous cette largeur, la sidebar est réduite par défaut. */
export const AUTO_COLLAPSE_BELOW = 1280

export type SidebarState = 'expanded' | 'collapsed'

export function readSidebarState(): SidebarState | null {
  try {
    const value = localStorage.getItem(SIDEBAR_KEY)
    return value === 'expanded' || value === 'collapsed' ? value : null
  } catch {
    return null
  }
}

export function writeSidebarState(state: SidebarState): void {
  try {
    localStorage.setItem(SIDEBAR_KEY, state)
  } catch {
    // stockage indisponible : l'état reste en mémoire
  }
}

/** État initial : valeur mémorisée, sinon réduit sous 1280px. */
export function getInitialCollapsed(width: number = window.innerWidth): boolean {
  const stored = readSidebarState()
  return stored ? stored === 'collapsed' : width < AUTO_COLLAPSE_BELOW
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar doit être utilisé dans un SidebarProvider')
  return context
}
