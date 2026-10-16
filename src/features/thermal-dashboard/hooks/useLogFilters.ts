import { useMemo, useState } from 'react'
import type { Recommendation } from '@/types/domain'
import { DEFAULT_FILTERS, filterLogs, type LogFilters } from '../utils/log-filters'

/** État des filtres du tableau + liste filtrée. */
export function useLogFilters(recos: Recommendation[]) {
  const [filters, setFilters] = useState<LogFilters>(DEFAULT_FILTERS)
  const filtered = useMemo(() => filterLogs(recos, filters), [recos, filters])

  const setFilter = <K extends keyof LogFilters>(key: K, value: LogFilters[K]) =>
    setFilters((previous) => ({ ...previous, [key]: value }))

  return { filters, setFilter, filtered }
}
