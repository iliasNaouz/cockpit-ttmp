import type { HistoryFilters } from '../hooks/useHistoryFilters'

/** Fin des données de démo (24 h du 2026-10-17). */
export const DATA_END = Date.parse('2026-10-17T23:59:00.000Z')

const HOURS: Record<string, number> = { '6h': 6, '24h': 24, '7j': 24 * 7 }

export interface TimeWindow {
  from: string
  to: string
  fromMs: number
  toMs: number
}

/** Fenêtre [from, to] déduite de la période (ou de la plage perso). */
export function resolveWindow(filters: HistoryFilters, now: number = DATA_END): TimeWindow {
  if (filters.period === 'perso' && filters.from && filters.to) {
    return { from: filters.from, to: filters.to, fromMs: Date.parse(filters.from), toMs: Date.parse(filters.to) }
  }
  const hours = HOURS[filters.period] ?? 24
  const toMs = now
  const fromMs = toMs - hours * 3_600_000
  return { from: new Date(fromMs).toISOString(), to: new Date(toMs).toISOString(), fromMs, toMs }
}
