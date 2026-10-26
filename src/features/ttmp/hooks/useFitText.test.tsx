import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FIT_FONT_SIZES, useFitText } from './useFitText'

/**
 * jsdom ne calcule pas la mise en page : on simule la hauteur du contenu.
 * `contentPx` = hauteur du texte ; le parent offre 40px. Si le texte dépasse à 14px
 * mais tient à une taille plus petite, le hook doit descendre d'un palier.
 */
function Harness({ contentPx }: { contentPx: (fontSize: number) => number }) {
  const { fontSize, register } = useFitText(1, [])
  return (
    <div style={{ height: 40 }} data-testid="parent">
      <p
        ref={(element) => {
          if (!element) return
          Object.defineProperty(element.parentElement as HTMLElement, 'clientHeight', { value: 40, configurable: true })
          Object.defineProperty(element, 'scrollHeight', {
            configurable: true,
            get() {
              return contentPx(parseFloat(this.style.fontSize || `${FIT_FONT_SIZES[0]}`))
            },
          })
          register(0)(element)
        }}
        style={{ fontSize: `${fontSize}px` }}
      >
        texte
      </p>
      <span data-testid="size">{fontSize}</span>
    </div>
  )
}

afterEach(() => vi.restoreAllMocks())

describe('useFitText', () => {
  it('garde 14px quand le texte tient', () => {
    const { getByTestId } = render(<Harness contentPx={() => 30} />)
    expect(getByTestId('size').textContent).toBe('14')
  })

  it('réduit la taille quand le texte déborde à 14px', () => {
    // 10px de hauteur par unité de police : 14px → 140 (déborde), 12px → 120… toujours > 40.
    const { getByTestId } = render(<Harness contentPx={(size) => size * 10} />)
    expect(Number(getByTestId('size').textContent)).toBeLessThan(14)
  })

  it('descend juste d’un palier quand 13px suffit', () => {
    // Déborde à 14px (42 > 40) mais tient dès 13px (39 ≤ 40).
    const { getByTestId } = render(<Harness contentPx={(size) => (size >= 14 ? 42 : 39)} />)
    expect(getByTestId('size').textContent).toBe('13')
  })
})
