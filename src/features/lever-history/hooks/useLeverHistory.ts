import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSite } from '@/contexts/site-store'
import * as api from '@/data/services/api'
import type {
  ChangeEffect,
  ChangeOrigin,
  HistorySummary,
  LeverHistoryData,
  RecoMatch,
} from '@/types/lever-history'
import { computeEffects } from '../utils/compute-effects'
import { matchRecosToChanges } from '../utils/match-recos'
import { summarize } from '../utils/summarize'

export interface DerivedHistory {
  data: LeverHistoryData
  matches: RecoMatch[]
  origins: Map<string, ChangeOrigin>
  effects: Map<string, ChangeEffect>
  summary: HistorySummary
  /** Issue de reco par id de changement rattaché. */
  outcomeByChange: Map<string, RecoMatch['outcome']>
}

function derive(data: LeverHistoryData): DerivedHistory {
  const { matches, origins } = matchRecosToChanges(data.recos, data.changes)
  const effects = computeEffects(data.changes, data.steam, data.o2)
  const summary = summarize(matches, data.changes, origins)
  const outcomeByChange = new Map<string, RecoMatch['outcome']>()
  for (const match of matches) {
    if (match.changeId) outcomeByChange.set(match.changeId, match.outcome)
  }
  return { data, matches, origins, effects, summary, outcomeByChange }
}

/** Charge l'historique du site courant puis applique la logique pure (rapprochement, effets, KPI). */
export function useLeverHistory(from?: string, to?: string) {
  const { siteId } = useSite()
  const query = useQuery({
    queryKey: ['lever-history', siteId, from ?? null, to ?? null],
    queryFn: () => api.getLeverHistory(siteId, from, to),
  })

  const derived = useMemo(() => (query.data ? derive(query.data) : null), [query.data])

  return { derived, isLoading: query.isLoading }
}
