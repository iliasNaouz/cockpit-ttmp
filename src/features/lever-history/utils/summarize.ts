import type { ChangeOrigin, HistorySummary, LeverChange, RecoMatch, RecoOutcome } from '@/types/lever-history'

const EMPTY_OUTCOMES: Record<RecoOutcome, number> = { suivie: 0, partielle: 0, contraire: 0, ignoree: 0 }

/** KPI de la page : volume de changements, issues des recos, taux de suivi, initiatives, délai moyen. */
export function summarize(matches: RecoMatch[], changes: LeverChange[], origins: Map<string, ChangeOrigin>): HistorySummary {
  const outcomes = { ...EMPTY_OUTCOMES }
  for (const match of matches) outcomes[match.outcome] += 1

  const followed = matches.filter((match) => match.outcome === 'suivie' || match.outcome === 'partielle')
  const followRate = matches.length === 0 ? 0 : Math.round((followed.length / matches.length) * 100)

  const delays = matches
    .filter((match) => match.outcome === 'suivie' && match.delayMin !== undefined)
    .map((match) => match.delayMin as number)
  const avgDelayMin = delays.length === 0 ? 0 : Math.round(delays.reduce((sum, value) => sum + value, 0) / delays.length)

  const initiativeCount = changes.filter((change) => origins.get(change.id) === 'initiative').length
  const operatorChangeCount = changes.filter((change) => change.source === 'operateur').length

  return {
    changeCount: changes.length,
    operatorChangeCount,
    recoCount: matches.length,
    outcomes,
    followRate,
    initiativeCount,
    avgDelayMin,
  }
}

/** Échantillonne une série en gardant les points de marche, pour limiter le rendu (~max points). */
export function sampleSteps<T extends { value: number }>(points: T[], max = 600): T[] {
  if (points.length <= max) return points
  const kept: T[] = []
  const stride = Math.ceil(points.length / max)
  for (let i = 0; i < points.length; i += 1) {
    const isEdge = i === 0 || i === points.length - 1
    const isStep = i > 0 && points[i].value !== points[i - 1].value
    if (isEdge || isStep || i % stride === 0) kept.push(points[i])
  }
  return kept
}
