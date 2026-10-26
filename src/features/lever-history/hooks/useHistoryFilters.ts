import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { LeverGroup } from '@/types/lever-history'

export type HistoryPeriod = '6h' | '24h' | '7j' | 'perso'
export type HistoryView = 'timeline' | 'matrice'
export type GroupFilter = 'all' | LeverGroup

export interface HistoryFilters {
  period: HistoryPeriod
  group: GroupFilter
  /** Leviers sélectionnés ; vide = tous. */
  levers: string[]
  view: HistoryView
  showRecos: boolean
  showEffects: boolean
  changesOnly: boolean
  /** Fenêtre perso (ISO), si `period === 'perso'`. */
  from?: string
  to?: string
}

const PERIODS: HistoryPeriod[] = ['6h', '24h', '7j', 'perso']
const VIEWS: HistoryView[] = ['timeline', 'matrice']
const GROUPS: GroupFilter[] = ['all', 'alimentateurs', 'grilles', 'air', 'combustion', 'vapeur']

function parseBool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback
  return value === '1' || value === 'true'
}

/** Filtres de la page synchronisés avec l'URL : un lien partagé rouvre la même vue. */
export function useHistoryFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<HistoryFilters>(() => {
    const period = PERIODS.find((value) => value === params.get('period')) ?? '24h'
    const group = GROUPS.find((value) => value === params.get('group')) ?? 'all'
    const view = VIEWS.find((value) => value === params.get('view')) ?? 'timeline'
    const leversParam = params.get('levers') ?? params.get('lever') ?? ''
    const levers = leversParam ? leversParam.split(',').filter(Boolean) : []
    return {
      period,
      group,
      view,
      levers,
      showRecos: parseBool(params.get('recos'), true),
      showEffects: parseBool(params.get('effets'), true),
      changesOnly: parseBool(params.get('changesOnly'), false),
      from: params.get('from') ?? undefined,
      to: params.get('to') ?? undefined,
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<HistoryFilters>) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          const apply = (key: string, value: string | undefined | null, fallback?: string) => {
            if (value === undefined || value === null || value === '' || value === fallback) next.delete(key)
            else next.set(key, value)
          }
          if ('period' in patch) apply('period', patch.period, '24h')
          if ('group' in patch) apply('group', patch.group, 'all')
          if ('view' in patch) apply('view', patch.view, 'timeline')
          if ('levers' in patch) {
            next.delete('lever')
            apply('levers', patch.levers?.join(','), '')
          }
          if ('showRecos' in patch) apply('recos', patch.showRecos ? undefined : '0')
          if ('showEffects' in patch) apply('effets', patch.showEffects ? undefined : '0')
          if ('changesOnly' in patch) apply('changesOnly', patch.changesOnly ? '1' : undefined)
          if ('from' in patch) apply('from', patch.from)
          if ('to' in patch) apply('to', patch.to)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  return { filters, update }
}
