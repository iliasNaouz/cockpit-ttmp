import { useEffect, useRef, useState } from 'react'

const DEFAULT_DURATION = 400

/**
 * Valeur animée (comptage) : la première valeur s'affiche telle quelle,
 * puis chaque changement est animé depuis la valeur affichée sur `duration` ms.
 */
export function useCountUp(target: number, duration = DEFAULT_DURATION): number {
  const [display, setDisplay] = useState(target)
  const displayRef = useRef(target)

  useEffect(() => {
    const from = displayRef.current
    if (from === target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof requestAnimationFrame !== 'function') {
      displayRef.current = target
      const id = window.setTimeout(() => setDisplay(target), 0)
      return () => window.clearTimeout(id)
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = progress === 1 ? target : from + (target - from) * eased
      displayRef.current = value
      setDisplay(value)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return display
}
