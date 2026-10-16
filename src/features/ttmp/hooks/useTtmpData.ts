import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSite } from '@/contexts/site-store'
import * as api from '@/data/services/api'
import type { SiteId } from '@/types/domain'

export const ttmpKeys = {
  status: (siteId: SiteId) => ['ttmp', 'status', siteId] as const,
  levers: (siteId: SiteId) => ['ttmp', 'levers', siteId] as const,
  stability: (siteId: SiteId) => ['ttmp', 'stability', siteId] as const,
}

export function useTtmpStatus() {
  const { siteId } = useSite()
  // Garde la valeur précédente pendant le rechargement : les KPI s'animent au changement de site.
  return useQuery({ queryKey: ttmpKeys.status(siteId), queryFn: () => api.getTtmpStatus(siteId), placeholderData: keepPreviousData })
}

export function useSliderLevers() {
  const { siteId } = useSite()
  return useQuery({ queryKey: ttmpKeys.levers(siteId), queryFn: () => api.getSliderLevers(siteId) })
}

/** Courbe de stabilité vapeur 1 h (utilisée aussi par l'aperçu de la page de connexion). */
export function useStability() {
  const { siteId } = useSite()
  return useQuery({ queryKey: ttmpKeys.stability(siteId), queryFn: () => api.getStability(siteId) })
}
