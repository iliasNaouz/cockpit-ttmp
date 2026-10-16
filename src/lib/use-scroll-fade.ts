import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react'

const BOTTOM_TOLERANCE_PX = 2

/**
 * Indique si un conteneur défilant a encore du contenu sous la zone visible
 * (pour afficher un fondu de bas de bloc). Suit les redimensionnements du conteneur et de son contenu.
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [showFade, setShowFade] = useState(false)

  const measure = useCallback((element: HTMLElement) => {
    setShowFade(element.scrollHeight - element.scrollTop - element.clientHeight > BOTTOM_TOLERANCE_PX)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => measure(element))
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => observer.disconnect()
  }, [measure])

  const onScroll = useCallback((event: UIEvent<T>) => measure(event.currentTarget), [measure])

  return { ref, showFade, onScroll }
}
