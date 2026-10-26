import { describe, expect, it } from 'vitest'
import { getKpiStatus, isO2Low } from './kpi'

describe('getKpiStatus', () => {
  it('note l’écart selon 0,5 et 1,5 t/h', () => {
    expect(getKpiStatus('ecart', 0.5)).toBe('bon')
    expect(getKpiStatus('ecart', -0.5)).toBe('bon')
    expect(getKpiStatus('ecart', 1)).toBe('surveiller')
    expect(getKpiStatus('ecart', -1.5)).toBe('surveiller')
    expect(getKpiStatus('ecart', 2)).toBe('alerte')
  })

  it('note l’O₂ selon les seuils 5 % et 4,5 %', () => {
    expect(getKpiStatus('o2', 5)).toBe('bon')
    expect(getKpiStatus('o2', 4.7)).toBe('surveiller')
    expect(getKpiStatus('o2', 4.23)).toBe('alerte')
  })

  it('note la stabilité selon 95 % et 85 %', () => {
    expect(getKpiStatus('stabilite', 99)).toBe('bon')
    expect(getKpiStatus('stabilite', 90)).toBe('surveiller')
    expect(getKpiStatus('stabilite', 80)).toBe('alerte')
  })

  it('reste neutre pour les KPI informatifs', () => {
    expect(getKpiStatus('neutre', 36.78)).toBe('normal')
  })
})

describe('isO2Low', () => {
  it('détecte un O₂ sous le seuil de 5 %', () => {
    expect(isO2Low(4.23)).toBe(true)
    expect(isO2Low(5)).toBe(false)
    expect(isO2Low(4.9, 4.8)).toBe(false)
  })
})
