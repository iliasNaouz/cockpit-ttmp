import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isEditableTarget } from '@/lib/dom'
import {
  SidebarContext,
  getInitialCollapsed,
  writeSidebarState,
  type SidebarContextValue,
} from './sidebar-store'

/** État réduit / déployé de la sidebar, mémorisé, avec le raccourci Ctrl/⌘+B. */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => getInitialCollapsed())

  const toggle = useCallback(() => {
    setCollapsed((previous) => {
      writeSidebarState(previous ? 'expanded' : 'collapsed')
      return !previous
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b' && !isEditableTarget(event.target)) {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const value = useMemo<SidebarContextValue>(() => ({ collapsed, toggle }), [collapsed, toggle])
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
