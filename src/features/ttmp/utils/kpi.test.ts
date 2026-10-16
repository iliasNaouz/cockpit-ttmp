import { describe, expect, it } from 'vitest'
import { getDeltaTone, getO2Tone, isO2Low } from './kpi'

describe('kpi ttmp', () => {
  it('colore l’écart selon 1 t/h', () => {
    expect(getDeltaTone(0.78)).toBe('success')
    expect(getDeltaTone(-1)).toBe('success')
    expect(getDeltaTone(1.01)).toBe('warning')
    expect(getDeltaTone(-2)).toBe('warning')
  })

  it('colore l’O₂ selon le seuil de 5 %', () => {
    expect(getO2Tone(4.23, 5)).toBe('danger')
    expect(getO2Tone(5, 5)).toBe('success')
    expect(isO2Low(4.99, 5)).toBe(true)
    expect(isO2Low(5.2, 5)).toBe(false)
  })
})
