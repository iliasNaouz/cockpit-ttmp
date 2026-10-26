import { describe, expect, it } from 'vitest'
import { DIAGNOSTIC } from './diagnostic'

const SUMMARY_MAX = 280

describe('mock diagnostic', () => {
  it('garde des paragraphes de 280 caractères maximum', () => {
    for (const block of [DIAGNOSTIC.diagnostic, DIAGNOSTIC.action, DIAGNOSTIC.rationale]) {
      expect(block.summary.length).toBeLessThanOrEqual(SUMMARY_MAX)
    }
  })

  it('conserve les textes longs pour l’API, hors affichage', () => {
    expect(DIAGNOSTIC.fullText.diagnostic.length).toBeGreaterThan(SUMMARY_MAX)
  })
})
