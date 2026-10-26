import { describe, expect, it } from 'vitest'
import type { LeverChange, LeverDef, LeverPoint, LeverReco, LeverSeries } from '@/types/lever-history'
import { computeEffects } from './compute-effects'
import { detectChanges } from './detect-changes'
import { matchRecosToChanges } from './match-recos'
import { sampleSteps, summarize } from './summarize'

const DEF: LeverDef = { id: 'BEG2244', label: 'Registre Z2', group: 'air', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } }

/** Série au pas de 1 min à partir d'une liste de valeurs. */
function series(values: number[], start = '2026-10-17T10:00:00.000Z'): LeverSeries {
  const base = new Date(start).getTime()
  const points: LeverPoint[] = values.map((value, index) => ({ t: new Date(base + index * 60_000).toISOString(), value }))
  return { leverId: DEF.id, points }
}

function reco(partial: Partial<LeverReco>): LeverReco {
  return { id: 'r1', leverId: DEF.id, t: '2026-10-17T10:00:00.000Z', direction: 'Up', text: '', ...partial }
}

describe('detectChanges', () => {
  it('repère une marche maintenue et ignore une fluctuation brève', () => {
    // 50 → pic bref à 56 (1 min) → retour 50 → palier 55 tenu.
    const changes = detectChanges(series([50, 50, 56, 50, 50, 55, 55, 55, 55]), DEF, { minDelta: 3, holdMin: 3 })
    expect(changes).toHaveLength(1)
    expect(changes[0].from).toBe(50)
    expect(changes[0].to).toBe(55)
    expect(changes[0].delta).toBe(5)
  })

  it('ne retient rien sous le seuil', () => {
    expect(detectChanges(series([50, 51, 50, 51]), DEF, { minDelta: 3 })).toHaveLength(0)
  })
})

describe('matchRecosToChanges', () => {
  const change = (t: string, from: number, to: number): LeverChange => ({
    id: `c-${t}`,
    leverId: DEF.id,
    t,
    from,
    to,
    delta: to - from,
    source: 'operateur',
  })

  it('suivie : même sens, à l’heure, amplitude suffisante', () => {
    const { matches, origins } = matchRecosToChanges(
      [reco({ direction: 'Up', target: 52 })],
      [change('2026-10-17T10:10:00.000Z', 50, 52)],
    )
    expect(matches[0].outcome).toBe('suivie')
    expect(matches[0].delayMin).toBe(10)
    expect(origins.get('c-2026-10-17T10:10:00.000Z')).toBe('suite_reco')
  })

  it('partielle : en retard au-delà de 30 min', () => {
    const { matches } = matchRecosToChanges([reco({ direction: 'Up', target: 52 })], [change('2026-10-17T10:45:00.000Z', 50, 52)])
    expect(matches[0].outcome).toBe('partielle')
  })

  it('partielle : amplitude sous 50 % de la demande', () => {
    const { matches } = matchRecosToChanges([reco({ direction: 'Up', target: 60 })], [change('2026-10-17T10:10:00.000Z', 50, 52)])
    expect(matches[0].outcome).toBe('partielle')
  })

  it('contraire : sens opposé dans les 60 min', () => {
    const { matches } = matchRecosToChanges([reco({ direction: 'Up' })], [change('2026-10-17T10:20:00.000Z', 50, 46)])
    expect(matches[0].outcome).toBe('contraire')
  })

  it('ignoree : aucun changement dans les 60 min', () => {
    const { matches, origins } = matchRecosToChanges(
      [reco({ direction: 'Up' })],
      [change('2026-10-17T12:00:00.000Z', 50, 52)],
    )
    expect(matches[0].outcome).toBe('ignoree')
    // Le changement tardif reste une initiative.
    expect(origins.get('c-2026-10-17T12:00:00.000Z')).toBe('initiative')
  })

  it('Hold : suivie si rien ne bouge, contraire sinon', () => {
    expect(matchRecosToChanges([reco({ direction: 'Hold' })], []).matches[0].outcome).toBe('suivie')
    const moved = matchRecosToChanges([reco({ direction: 'Hold' })], [change('2026-10-17T10:10:00.000Z', 50, 55)])
    expect(moved.matches[0].outcome).toBe('contraire')
  })
})

describe('computeEffects', () => {
  it('calcule les écarts à +15 et +30 min', () => {
    const steam = series([36, 36, 36], '2026-10-17T10:00:00.000Z')
    // Construit manuellement 31 points de vapeur et d'O₂.
    const steamPts: LeverPoint[] = Array.from({ length: 31 }, (_, i) => ({ t: new Date(Date.parse('2026-10-17T10:00:00.000Z') + i * 60_000).toISOString(), value: 36 + i * 0.02 }))
    const o2Pts: LeverPoint[] = Array.from({ length: 31 }, (_, i) => ({ t: new Date(Date.parse('2026-10-17T10:00:00.000Z') + i * 60_000).toISOString(), value: 4.2 + i * 0.03 }))
    void steam
    const change: LeverChange = { id: 'c1', leverId: DEF.id, t: '2026-10-17T10:00:00.000Z', from: 50, to: 52, delta: 2, source: 'operateur' }
    const effects = computeEffects([change], steamPts, o2Pts)
    expect(effects.get('c1')?.steamDelta15).toBeCloseTo(0.3, 2)
    expect(effects.get('c1')?.o2Delta30).toBeCloseTo(0.9, 2)
  })
})

describe('summarize', () => {
  it('agrège les KPI', () => {
    const changes: LeverChange[] = [
      { id: 'a', leverId: DEF.id, t: '', from: 0, to: 1, delta: 1, source: 'operateur' },
      { id: 'b', leverId: DEF.id, t: '', from: 0, to: 1, delta: 1, source: 'regulation' },
    ]
    const origins = new Map([['a', 'suite_reco' as const], ['b', 'initiative' as const]])
    const summary = summarize(
      [
        { recoId: 'r1', changeId: 'a', outcome: 'suivie', delayMin: 10 },
        { recoId: 'r2', outcome: 'ignoree' },
      ],
      changes,
      origins,
    )
    expect(summary.changeCount).toBe(2)
    expect(summary.operatorChangeCount).toBe(1)
    expect(summary.initiativeCount).toBe(1)
    expect(summary.outcomes.suivie).toBe(1)
    expect(summary.followRate).toBe(50)
    expect(summary.avgDelayMin).toBe(10)
  })
})

describe('sampleSteps', () => {
  it('garde les points de marche et borne le total', () => {
    const points = Array.from({ length: 2000 }, (_, i) => ({ value: i < 1000 ? 10 : 20 }))
    const sampled = sampleSteps(points, 300)
    expect(sampled.length).toBeLessThanOrEqual(320)
    expect(sampled.some((p) => p.value === 20)).toBe(true)
  })
})
