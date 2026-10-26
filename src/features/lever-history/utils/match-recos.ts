import type { ChangeOrigin, LeverChange, LeverReco, RecoMatch } from '@/types/lever-history'

export interface MatchOptions {
  /** Fenêtre « à l'heure » après la reco (minutes). */
  windowMin?: number
  /** Fenêtre « en retard » après la reco (minutes). */
  lateWindowMin?: number
  /** Part minimale de l'écart demandé pour parler de reco « suivie ». */
  minAmplitudeRatio?: number
}

const minutesBetween = (from: string, to: string): number => (new Date(to).getTime() - new Date(from).getTime()) / 60_000

function expectedSign(reco: LeverReco): 1 | -1 | 0 {
  if (reco.direction === 'Up') return 1
  if (reco.direction === 'Down') return -1
  return 0
}

/** Amplitude atteinte vs amplitude demandée (si la cible est connue), sinon `null`. */
function amplitudeRatio(reco: LeverReco, change: LeverChange): number | null {
  if (reco.target === undefined) return null
  const requested = reco.target - change.from
  if (requested === 0) return 1
  return change.delta / requested
}

/**
 * Rapproche chaque recommandation du premier changement postérieur du même levier, et en déduit
 * si elle a été suivie, partiellement, à contre-sens, ou ignorée. Les reco « Hold » sont suivies
 * si rien ne bouge dans la fenêtre. Renvoie aussi l'origine de chaque changement.
 */
export function matchRecosToChanges(
  recos: LeverReco[],
  changes: LeverChange[],
  options: MatchOptions = {},
): { matches: RecoMatch[]; origins: Map<string, ChangeOrigin> } {
  const windowMin = options.windowMin ?? 30
  const lateWindowMin = options.lateWindowMin ?? 60
  const minRatio = options.minAmplitudeRatio ?? 0.5

  const origins = new Map<string, ChangeOrigin>()
  for (const change of changes) origins.set(change.id, 'initiative')

  const matches = recos.map<RecoMatch>((reco) => {
    const sign = expectedSign(reco)
    const after = changes
      .filter((change) => change.leverId === reco.leverId && minutesBetween(reco.t, change.t) >= 0)
      .map((change) => ({ change, delay: minutesBetween(reco.t, change.t) }))
      .sort((a, b) => a.delay - b.delay)

    if (reco.direction === 'Hold') {
      const moved = after.find(({ delay }) => delay <= windowMin)
      if (moved) {
        origins.set(moved.change.id, 'suite_reco')
        return { recoId: reco.id, changeId: moved.change.id, outcome: 'contraire', delayMin: moved.delay }
      }
      return { recoId: reco.id, outcome: 'suivie' }
    }

    const opposite = after.find(({ change, delay }) => delay <= lateWindowMin && Math.sign(change.delta) === -sign)
    const sameWay = after.find(({ change, delay }) => delay <= lateWindowMin && Math.sign(change.delta) === sign)

    if (opposite && (!sameWay || opposite.delay < sameWay.delay)) {
      origins.set(opposite.change.id, 'suite_reco')
      return { recoId: reco.id, changeId: opposite.change.id, outcome: 'contraire', delayMin: opposite.delay }
    }
    if (!sameWay) {
      return { recoId: reco.id, outcome: 'ignoree' }
    }

    origins.set(sameWay.change.id, 'suite_reco')
    const ratio = amplitudeRatio(reco, sameWay.change)
    const onTime = sameWay.delay <= windowMin
    const enough = ratio === null || ratio >= minRatio
    const outcome = onTime && enough ? 'suivie' : 'partielle'
    return { recoId: reco.id, changeId: sameWay.change.id, outcome, delayMin: sameWay.delay }
  })

  return { matches, origins }
}
