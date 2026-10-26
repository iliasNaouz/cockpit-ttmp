import type { ChangeEffect, LeverChange, LeverPoint } from '@/types/lever-history'

/** Valeur de la série au plus proche de `t + offsetMin`, ou `null` hors plage. */
function valueAt(points: LeverPoint[], from: string, offsetMin: number): number | null {
  if (points.length === 0) return null
  const target = new Date(from).getTime() + offsetMin * 60_000
  let best: LeverPoint | null = null
  let bestGap = Number.POSITIVE_INFINITY
  for (const point of points) {
    const gap = Math.abs(new Date(point.t).getTime() - target)
    if (gap < bestGap) {
      bestGap = gap
      best = point
    }
  }
  // Rejette si le point le plus proche est à plus de 2 min de la cible (hors plage de données).
  return best && bestGap <= 2 * 60_000 ? best.value : null
}

function delta(points: LeverPoint[], from: string, offsetMin: number): number {
  const start = valueAt(points, from, 0)
  const end = valueAt(points, from, offsetMin)
  if (start === null || end === null) return 0
  return Number((end - start).toFixed(2))
}

/** Écarts de vapeur et d'O₂ observés à +15 et +30 min après chaque changement. */
export function computeEffects(changes: LeverChange[], steam: LeverPoint[], o2: LeverPoint[]): Map<string, ChangeEffect> {
  const effects = new Map<string, ChangeEffect>()
  for (const change of changes) {
    effects.set(change.id, {
      changeId: change.id,
      steamDelta15: delta(steam, change.t, 15),
      o2Delta15: delta(o2, change.t, 15),
      steamDelta30: delta(steam, change.t, 30),
      o2Delta30: delta(o2, change.t, 30),
    })
  }
  return effects
}
