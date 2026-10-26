import type { Direction } from '@/types/domain'
import type {
  LeverChange,
  LeverDef,
  LeverHistoryData,
  LeverPoint,
  LeverReco,
  LeverSeries,
} from '@/types/lever-history'

/** Générateur pseudo-aléatoire à graine (LCG) : mocks reproductibles pour des tests stables. */
function makeRng(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const DAY_MIN = 24 * 60
const STEP_MS = 60_000

/** 14 leviers répartis sur les 5 groupes. */
export const LEVER_DEFS: LeverDef[] = [
  { id: 'BEG2244', label: 'Registre air primaire Z2', group: 'air', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'AIR_SECONDAIRE', label: 'Air secondaire', group: 'air', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'AIR_Z1', label: 'Registre air primaire Z1', group: 'air', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'POUSSOIR', label: 'Poussoir', group: 'alimentateurs', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'ALIM_SUP', label: 'Vitesse alimentateur supérieur', group: 'alimentateurs', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'ALIM_INF', label: 'Vitesse alimentateur inférieur', group: 'alimentateurs', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'GRILLE_V1', label: 'Vitesse grille 1', group: 'grilles', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'GRILLE_V2', label: 'Vitesse grille 2', group: 'grilles', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'GRILLE_V3', label: 'Vitesse grille 3', group: 'grilles', unit: '%', min: 0, max: 100, zones: { low: 20, high: 80 } },
  { id: 'O2_CONSIGNE', label: 'Consigne O₂', group: 'combustion', unit: '%', min: 0, max: 12, zones: { low: 4, high: 8 } },
  { id: 'DEPRESSION', label: 'Dépression foyer', group: 'combustion', unit: 'mbar', min: -8, max: 0, zones: { low: -5, high: -2 } },
  { id: 'PRESSION_Z2', label: 'Pression zone 2', group: 'combustion', unit: 'mbar', min: 0, max: 20, zones: { low: 6, high: 14 } },
  { id: 'VAP_CONSIGNE', label: 'Consigne débit vapeur', group: 'vapeur', unit: 't/h', min: 20, max: 45, zones: { low: 28, high: 40 } },
  { id: 'BALLON', label: 'Pression ballon', group: 'vapeur', unit: 'mbar', min: 0, max: 100, zones: { low: 40, high: 80 } },
]

interface Built {
  series: LeverSeries
  changes: LeverChange[]
}

/** Construit la série réelle d'un levier en paliers, et les changements correspondants. */
function buildLever(def: LeverDef, start: number, rng: () => number): Built {
  const points: LeverPoint[] = []
  const changes: LeverChange[] = []
  const span = def.max - def.min
  let value = def.min + span * (0.35 + rng() * 0.3)
  // 1 à 4 changements dans la journée, à des minutes croissantes.
  const changeCount = 1 + Math.floor(rng() * 4)
  const changeMinutes = Array.from({ length: changeCount }, () => 30 + Math.floor(rng() * (DAY_MIN - 60))).sort((a, b) => a - b)
  let next = 0

  for (let minute = 0; minute < DAY_MIN; minute += 1) {
    if (next < changeMinutes.length && minute === changeMinutes[next]) {
      const from = value
      const amplitude = span * (0.04 + rng() * 0.12)
      const dir = rng() > 0.5 ? 1 : -1
      value = Math.min(def.max, Math.max(def.min, value + dir * amplitude))
      const t = new Date(start + minute * STEP_MS).toISOString()
      changes.push({
        id: `${def.id}-chg-${minute}`,
        leverId: def.id,
        t,
        from: Number(from.toFixed(2)),
        to: Number(value.toFixed(2)),
        delta: Number((value - from).toFixed(2)),
        source: rng() > 0.25 ? 'operateur' : 'regulation',
      })
      next += 1
    }
    // Léger bruit autour du palier, borné.
    const noisy = value + (rng() - 0.5) * span * 0.004
    points.push({ t: new Date(start + minute * STEP_MS).toISOString(), value: Number(noisy.toFixed(2)) })
  }

  return { series: { leverId: def.id, points }, changes }
}

/** Reco émise peu avant un changement (pour obtenir le mélange d'issues demandé). */
function buildRecos(changes: LeverChange[], rng: () => number): LeverReco[] {
  const recos: LeverReco[] = []
  changes.forEach((change, index) => {
    const roll = rng()
    // ~20 % des changements sont des initiatives : pas de reco.
    if (roll < 0.2) return
    const direction: Direction = change.delta > 0 ? 'Up' : 'Down'
    // Délai de la reco avant le changement : 5 à 40 min (certaines seront « partielles » car en retard).
    const lead = 5 + Math.floor(rng() * 36)
    const t = new Date(new Date(change.t).getTime() - lead * STEP_MS).toISOString()
    recos.push({
      id: `reco-${index}`,
      leverId: change.leverId,
      t,
      direction,
      target: Number(change.to.toFixed(1)),
      text: `Ajuster ${change.leverId} vers ${change.to.toFixed(0)}`,
    })
  })
  // Quelques recos « ignorées » supplémentaires, sans changement en face.
  for (let i = 0; i < 6; i += 1) {
    const def = LEVER_DEFS[Math.floor(rng() * LEVER_DEFS.length)]
    const minute = 60 + Math.floor(rng() * (DAY_MIN - 120))
    recos.push({
      id: `reco-x-${i}`,
      leverId: def.id,
      t: new Date(Date.parse('2026-10-17T00:00:00.000Z') + minute * STEP_MS).toISOString(),
      direction: rng() > 0.5 ? 'Up' : 'Down',
      target: Number((def.min + (def.max - def.min) * 0.6).toFixed(1)),
      text: `Reco ${def.label}`,
    })
  }
  return recos
}

/** Série de procédé (vapeur / O₂) : base bruitée, sans lien fin avec les leviers pour la démo. */
function buildProcess(start: number, rng: () => number, base: number, amp: number): LeverPoint[] {
  const points: LeverPoint[] = []
  let value = base
  for (let minute = 0; minute < DAY_MIN; minute += 1) {
    value += (rng() - 0.5) * amp
    value = base + (value - base) * 0.95
    points.push({ t: new Date(start + minute * STEP_MS).toISOString(), value: Number(value.toFixed(2)) })
  }
  return points
}

function buildHistory(seed: number): LeverHistoryData {
  const rng = makeRng(seed)
  const start = Date.parse('2026-10-17T00:00:00.000Z')
  const series: LeverSeries[] = []
  const changes: LeverChange[] = []
  for (const def of LEVER_DEFS) {
    const built = buildLever(def, start, rng)
    series.push(built.series)
    changes.push(...built.changes)
  }
  changes.sort((a, b) => a.t.localeCompare(b.t))
  const recos = buildRecos(changes, rng).sort((a, b) => a.t.localeCompare(b.t))
  return {
    defs: LEVER_DEFS,
    series,
    changes,
    recos,
    steam: buildProcess(start, rng, 36.5, 0.12),
    o2: buildProcess(start, rng, 5.2, 0.08),
  }
}

/** Historique par site (graines différentes), 24 h au pas de 1 min. */
export const LEVER_HISTORY: Record<string, LeverHistoryData> = {
  begles: buildHistory(42),
  rouen: buildHistory(7),
}
