import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Les pages sont chargées en différé : la première transformation peut dépasser 1 s.
configure({ asyncUtilTimeout: 8000 })

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Taille de bureau par défaut : sidebar déployée.
Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true, writable: true })

window.HTMLElement.prototype.scrollIntoView = () => {}
window.HTMLElement.prototype.scrollTo = () => {}

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  localStorage.clear()
})
