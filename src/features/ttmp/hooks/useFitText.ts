import { useCallback, useLayoutEffect, useRef, useState } from 'react'

/** Paliers de taille de police (px), du plus grand au plus petit. */
export const FIT_FONT_SIZES = [14, 13, 12.5, 12] as const

export interface FitText {
  /** Taille de police courante, commune à tous les paragraphes suivis. */
  fontSize: number
  /** À appeler pour chaque paragraphe : enregistre l'élément à mesurer. */
  register: (index: number) => (element: HTMLElement | null) => void
}

const biggest = FIT_FONT_SIZES[0]

/**
 * Choisit une taille de police unique pour `count` paragraphes afin qu'aucun ne déborde de son conteneur.
 * Descend d'un palier tant qu'un paragraphe dépasse, remonte quand la place revient (fenêtre, sidebar).
 * Aucun scroll ni coupure : la taille s'adapte à l'espace disponible.
 */
export function useFitText(count: number, deps: unknown[] = []): FitText {
  const elements = useRef<(HTMLElement | null)[]>([])
  const [fontSize, setFontSize] = useState<number>(biggest)

  const register = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      elements.current[index] = element
    },
    [],
  )

  const fit = useCallback(() => {
    const nodes = elements.current.slice(0, count).filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return

    // Un paragraphe déborde si son contenu est plus haut que la place offerte par le bloc parent.
    const overflowsAt = (size: number): boolean => {
      for (const node of nodes) {
        node.style.fontSize = `${size}px`
        const available = node.parentElement?.clientHeight ?? node.clientHeight
        if (node.scrollHeight > available + 0.5) return true
      }
      return false
    }

    let chosen = FIT_FONT_SIZES[FIT_FONT_SIZES.length - 1]
    for (const size of FIT_FONT_SIZES) {
      if (!overflowsAt(size)) {
        chosen = size
        break
      }
    }
    // Rétablit la taille retenue sur tous les éléments et met à jour l'état.
    for (const node of nodes) node.style.fontSize = `${chosen}px`
    setFontSize(chosen)
  }, [count])

  useLayoutEffect(() => {
    fit()
    const observer = new ResizeObserver(() => fit())
    const parents = new Set<HTMLElement>()
    for (const node of elements.current) {
      if (node) observer.observe(node)
      if (node?.parentElement) {
        observer.observe(node.parentElement)
        parents.add(node.parentElement)
      }
    }
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit, ...deps])

  return { fontSize, register }
}
