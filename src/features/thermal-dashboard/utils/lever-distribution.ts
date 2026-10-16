import { LEVER_ORDER } from '@/design-system/lever-styles'
import type { Direction, LeverName, Recommendation, RecommendedLever } from '@/types/domain'

export interface DistributionEntry {
  lever: LeverName
  count: number
  /** Part en % du total (0–100) */
  pct: number
  /** Direction la plus fréquente pour ce levier */
  direction: Direction
  /** Description d'exemple (première recommandation du levier) */
  description: string
}

/** « Timeout Error » est regroupé dans « Non défini » pour la répartition. */
export function toLeverBucket(lever: RecommendedLever): LeverName {
  return lever === 'Timeout Error' ? 'Non défini' : lever
}

function dominantDirection(recos: Recommendation[]): Direction {
  const counts: Record<Direction, number> = { Up: 0, Down: 0, Hold: 0 }
  for (const reco of recos) counts[reco.direction] += 1
  const order: Direction[] = ['Up', 'Down', 'Hold']
  return order.reduce((best, current) => (counts[current] > counts[best] ? current : best), 'Hold')
}

export function computeLeverDistribution(recos: Recommendation[]): DistributionEntry[] {
  const total = recos.length
  return LEVER_ORDER.map((lever) => {
    const matching = recos.filter((reco) => toLeverBucket(reco.lever) === lever)
    return {
      lever,
      count: matching.length,
      pct: total === 0 ? 0 : (matching.length / total) * 100,
      direction: dominantDirection(matching),
      description: matching[0]?.description ?? '',
    }
  })
}

export interface SequenceRun {
  lever: LeverName
  count: number
}

/** Regroupe les leviers consécutifs identiques : Poussoir, Poussoir → Poussoir (2). */
export function buildLeverRuns(recos: Recommendation[]): SequenceRun[] {
  const runs: SequenceRun[] = []
  for (const reco of recos) {
    const lever = toLeverBucket(reco.lever)
    const last = runs[runs.length - 1]
    if (last && last.lever === lever) last.count += 1
    else runs.push({ lever, count: 1 })
  }
  return runs
}

/** `Séquence dynamique : Action Manuelle (1) → Poussoir (2) → …` */
export function formatSequence(recos: Recommendation[], visibleRuns = 3): string {
  const runs = buildLeverRuns(recos)
  if (runs.length === 0) return 'Séquence dynamique : —'
  const head = runs.slice(0, visibleRuns).map((run) => `${run.lever} (${run.count})`).join(' → ')
  return `Séquence dynamique : ${head}${runs.length > visibleRuns ? ' → …' : ''}`
}
