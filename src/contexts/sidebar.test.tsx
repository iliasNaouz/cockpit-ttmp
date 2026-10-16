import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { SidebarProvider } from './sidebar-context'
import { SIDEBAR_KEY, getInitialCollapsed, useSidebar } from './sidebar-store'

const wrapper = ({ children }: { children: ReactNode }) => <SidebarProvider>{children}</SidebarProvider>

describe('useSidebar', () => {
  it('démarre déployé sur grand écran et bascule', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true })
    const { result } = renderHook(() => useSidebar(), { wrapper })
    expect(result.current.collapsed).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.collapsed).toBe(true)
  })

  it('mémorise l’état dans localStorage', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true })
    const { result } = renderHook(() => useSidebar(), { wrapper })
    act(() => result.current.toggle())
    expect(localStorage.getItem(SIDEBAR_KEY)).toBe('collapsed')
    act(() => result.current.toggle())
    expect(localStorage.getItem(SIDEBAR_KEY)).toBe('expanded')
  })

  it('relit l’état mémorisé au montage', () => {
    localStorage.setItem(SIDEBAR_KEY, 'collapsed')
    const { result } = renderHook(() => useSidebar(), { wrapper })
    expect(result.current.collapsed).toBe(true)
  })

  it('est réduit par défaut sous 1280px, sans préférence mémorisée', () => {
    expect(getInitialCollapsed(1100)).toBe(true)
    expect(getInitialCollapsed(1280)).toBe(false)
  })

  it('bascule avec Ctrl+B sauf dans un champ de saisie', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true })
    const { result } = renderHook(() => useSidebar(), { wrapper })
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true }))
    })
    expect(result.current.collapsed).toBe(true)

    const input = document.createElement('input')
    document.body.appendChild(input)
    act(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }))
    })
    expect(result.current.collapsed).toBe(true)
    input.remove()
  })
})
