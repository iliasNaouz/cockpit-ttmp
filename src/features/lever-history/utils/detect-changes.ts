import type { ChangeSource, LeverChange, LeverDef, LeverSeries } from '@/types/lever-history'

export interface DetectOptions {
  /** Variation minimale pour retenir une marche. Défaut : 1 % de la plage du levier. */
  minDelta?: number
  /** Durée minimale de maintien d'un palier (minutes). */
  holdMin?: number
  /** Détermine la source d'un changement (sinon « inconnu »). */
  sourceOf?: (leverId: string, index: number) => ChangeSource
}

const PAS_MINUTES = 1

/**
 * Repère les marches d'une série réelle : une variation d'au moins `minDelta` qui se maintient
 * au moins `holdMin` minutes par rapport au dernier palier stable. Les micro-fluctuations
 * (retours sous le seuil avant la fin du maintien) sont ignorées.
 */
export function detectChanges(series: LeverSeries, def: LeverDef, options: DetectOptions = {}): LeverChange[] {
  const { points } = series
  if (points.length < 2) return []

  const minDelta = options.minDelta ?? (def.max - def.min) * 0.01
  const holdSteps = Math.max(1, Math.round((options.holdMin ?? 3) / PAS_MINUTES))
  const changes: LeverChange[] = []

  // Niveau de référence = dernier palier confirmé.
  let baseline = points[0].value
  let candidateIndex = -1

  const confirm = (index: number) => {
    const to = points[index].value
    const delta = to - baseline
    const change: LeverChange = {
      id: `${series.leverId}-chg-${points[index].t}`,
      leverId: series.leverId,
      t: points[index].t,
      from: Number(baseline.toFixed(3)),
      to: Number(to.toFixed(3)),
      delta: Number(delta.toFixed(3)),
      source: options.sourceOf?.(series.leverId, index) ?? 'inconnu',
    }
    changes.push(change)
    baseline = to
  }

  for (let i = 1; i < points.length; i += 1) {
    const value = points[i].value
    if (Math.abs(value - baseline) < minDelta) {
      candidateIndex = -1
      continue
    }
    // On a franchi le seuil : vérifier que le nouveau niveau tient `holdSteps`.
    if (candidateIndex === -1) candidateIndex = i
    const heldLongEnough = i - candidateIndex + 1 >= holdSteps
    const stillBeyond = Math.abs(value - baseline) >= minDelta
    if (heldLongEnough && stillBeyond) {
      // Palier confirmé : on prend la valeur au moment où le seuil a été franchi.
      confirm(candidateIndex)
      candidateIndex = -1
    }
  }

  return changes
}
