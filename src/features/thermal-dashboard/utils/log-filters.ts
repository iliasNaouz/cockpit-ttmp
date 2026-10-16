import { getO2Status } from '@/lib/o2-status'
import type { Direction, O2Status, Recommendation, RecommendedLever } from '@/types/domain'

export const STEAM_SETPOINT = 40

export type LeverFilter = 'all' | RecommendedLever
export type ActionFilter = 'all' | Direction
export type O2Filter = 'all' | O2Status
export type OutputFilter = 'all' | 'above' | 'below'

export interface LogFilters {
  search: string
  lever: LeverFilter
  action: ActionFilter
  o2: O2Filter
  output: OutputFilter
}

export const DEFAULT_FILTERS: LogFilters = {
  search: '',
  lever: 'all',
  action: 'all',
  o2: 'all',
  output: 'all',
}

/** Écart du débit réel par rapport à la consigne (t/h), `null` sans mesure. */
export function deltaVsSetpoint(actual: number | null, setpoint = STEAM_SETPOINT): number | null {
  return actual === null ? null : actual - setpoint
}

/** Écart entre la prédiction à +15 min et la mesure actuelle. */
export function predictionDelta(actual: number | null, predicted: number | null): number | null {
  return actual === null || predicted === null ? null : predicted - actual
}

function matchesSearch(reco: Recommendation, search: string): boolean {
  const query = search.trim().toLowerCase()
  if (query === '') return true
  return [reco.timestamp, reco.lever, reco.tag, reco.title, reco.description]
    .join(' ')
    .toLowerCase()
    .includes(query)
}

export function filterLogs(recos: Recommendation[], filters: LogFilters): Recommendation[] {
  return recos.filter((reco) => {
    if (!matchesSearch(reco, filters.search)) return false
    if (filters.lever !== 'all' && reco.lever !== filters.lever) return false
    if (filters.action !== 'all' && reco.direction !== filters.action) return false
    if (filters.o2 !== 'all' && (reco.o2 === null || getO2Status(reco.o2) !== filters.o2)) return false
    if (filters.output !== 'all') {
      const delta = deltaVsSetpoint(reco.actualSteam)
      if (delta === null) return false
      if (filters.output === 'above' ? delta < 0 : delta >= 0) return false
    }
    return true
  })
}
