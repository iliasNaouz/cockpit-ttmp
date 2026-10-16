import { describe, expect, it } from 'vitest'
import { getO2Status } from '@/lib/o2-status'
import type { Recommendation } from '@/types/domain'
import { getContextWindow, getNeighbor } from './context-window'
import { buildLeverRuns, computeLeverDistribution, formatSequence } from './lever-distribution'
import { DEFAULT_FILTERS, deltaVsSetpoint, filterLogs, predictionDelta } from './log-filters'

function reco(overrides: Partial<Recommendation>): Recommendation {
  return {
    id: 'r',
    timestamp: '2026-04-08T04:46:00',
    actualSteam: 40.5,
    predictedSteam: 40.4,
    o2: 6,
    lever: 'Poussoir',
    direction: 'Up',
    grillePct: 47,
    poussoirPct: 29,
    tag: 'ROU_0449',
    title: 'Titre',
    description: 'Description',
    diagnostic: 'Diagnostic',
    rationale: 'Raison',
    consigne: 40,
    airPrimaireRpm: 1258.2,
    airSecondaireRpm: 12390.2,
    pressionZ2: 10.27,
    pressionZ3: 10.31,
    ...overrides,
  }
}

describe('getO2Status', () => {
  it('applique les seuils 6.5 et 7', () => {
    expect(getO2Status(6.49)).toBe('safe')
    expect(getO2Status(6.5)).toBe('near')
    expect(getO2Status(6.99)).toBe('near')
    expect(getO2Status(7)).toBe('alert')
  })
})

describe('computeLeverDistribution', () => {
  const recos = [
    reco({ lever: 'Poussoir' }),
    reco({ lever: 'Poussoir', direction: 'Down' }),
    reco({ lever: 'Poussoir', direction: 'Down' }),
    reco({ lever: 'Grille' }),
    reco({ lever: 'Timeout Error', direction: 'Hold' }),
  ]

  it('calcule les parts et regroupe les timeouts dans « Non défini »', () => {
    const distribution = computeLeverDistribution(recos)
    const byLever = Object.fromEntries(distribution.map((entry) => [entry.lever, entry]))
    expect(byLever['Poussoir'].count).toBe(3)
    expect(byLever['Poussoir'].pct).toBeCloseTo(60)
    expect(byLever['Non défini'].count).toBe(1)
    expect(distribution.reduce((sum, entry) => sum + entry.pct, 0)).toBeCloseTo(100)
  })

  it('retient la direction dominante', () => {
    const poussoir = computeLeverDistribution(recos).find((entry) => entry.lever === 'Poussoir')
    expect(poussoir?.direction).toBe('Down')
  })

  it('gère une liste vide', () => {
    expect(computeLeverDistribution([]).every((entry) => entry.pct === 0)).toBe(true)
  })
})

describe('séquence des leviers', () => {
  const recos = [
    reco({ lever: 'Action Manuelle' }),
    reco({ lever: 'Poussoir' }),
    reco({ lever: 'Poussoir' }),
    reco({ lever: 'Grille' }),
    reco({ lever: 'Air Secondaire' }),
  ]

  it('regroupe les leviers consécutifs', () => {
    expect(buildLeverRuns(recos).map((run) => run.count)).toEqual([1, 2, 1, 1])
  })

  it('formate la séquence avec une ellipse', () => {
    expect(formatSequence(recos)).toBe(
      'Séquence dynamique : Action Manuelle (1) → Poussoir (2) → Grille (1) → …',
    )
  })
})

describe('filtres et écarts', () => {
  it('calcule les écarts', () => {
    expect(deltaVsSetpoint(40.52)).toBeCloseTo(0.52)
    expect(deltaVsSetpoint(null)).toBeNull()
    expect(predictionDelta(40.52, 40.48)).toBeCloseTo(-0.04)
    expect(predictionDelta(null, 40)).toBeNull()
  })

  const recos = [
    reco({ id: 'a', lever: 'Poussoir', direction: 'Up', o2: 5.5, actualSteam: 40.5 }),
    reco({ id: 'b', lever: 'Grille', direction: 'Down', o2: 6.8, actualSteam: 39.2, tag: 'ROU_0111' }),
    reco({ id: 'c', lever: 'Timeout Error', direction: 'Hold', o2: null, actualSteam: null }),
  ]

  it('retourne tout sans filtre', () => {
    expect(filterLogs(recos, DEFAULT_FILTERS)).toHaveLength(3)
  })

  it('filtre par levier, action, O₂ et sortie', () => {
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, lever: 'Grille' }).map((r) => r.id)).toEqual(['b'])
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, action: 'Up' }).map((r) => r.id)).toEqual(['a'])
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, o2: 'near' }).map((r) => r.id)).toEqual(['b'])
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, output: 'above' }).map((r) => r.id)).toEqual(['a'])
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, output: 'below' }).map((r) => r.id)).toEqual(['b'])
  })

  it('recherche dans le tag, le levier et l’horodatage', () => {
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, search: 'rou_0111' }).map((r) => r.id)).toEqual(['b'])
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, search: '04:46' })).toHaveLength(3)
    expect(filterLogs(recos, { ...DEFAULT_FILTERS, search: 'inconnu' })).toHaveLength(0)
  })
})

describe('fenêtre de contexte', () => {
  const recos = Array.from({ length: 40 }, (_, index) =>
    reco({ id: `r${index}`, timestamp: `2026-04-08T${String(4 + Math.floor((46 + index) / 60)).padStart(2, '0')}:${String((46 + index) % 60).padStart(2, '0')}:00` }),
  )

  it('retourne ±15 minutes autour de la reco', () => {
    expect(getContextWindow(recos, 'r20')).toHaveLength(31)
  })

  it('est tronquée aux extrémités', () => {
    expect(getContextWindow(recos, 'r0')).toHaveLength(16)
    expect(getContextWindow(recos, 'inconnu')).toEqual([])
  })

  it('trouve la reco voisine ou null aux bords', () => {
    expect(getNeighbor(recos, 'r5', -1)?.id).toBe('r4')
    expect(getNeighbor(recos, 'r5', 1)?.id).toBe('r6')
    expect(getNeighbor(recos, 'r0', -1)).toBeNull()
    expect(getNeighbor(recos, 'r39', 1)).toBeNull()
  })
})
