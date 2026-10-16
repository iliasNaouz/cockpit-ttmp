import { useLayoutEffect, useRef, useState } from 'react'

export interface Size {
  width: number
  height: number
}

/** Taille réelle (px) d'un élément, suivie par ResizeObserver : permet de dessiner à l'échelle 1:1. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect ?? element.getBoundingClientRect()
      const next = { width: Math.round(rect.width), height: Math.round(rect.height) }
      setSize((previous) => (previous.width === next.width && previous.height === next.height ? previous : next))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}
