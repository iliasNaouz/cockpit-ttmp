import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSite } from '@/contexts/site-store'
import * as api from '@/data/services/api'
import type { NewRecommendationInput, RecommendationPatch } from '@/data/services/api'

export function useRecommendations() {
  const { siteId } = useSite()
  return useQuery({ queryKey: ['thermal', 'recommendations', siteId], queryFn: () => api.getRecommendations(siteId) })
}

export function useTelemetry() {
  const { siteId } = useSite()
  return useQuery({ queryKey: ['thermal', 'telemetry', siteId], queryFn: () => api.getTelemetry(siteId) })
}

export function useAgentHealth() {
  const { siteId } = useSite()
  return useQuery({ queryKey: ['thermal', 'health', siteId], queryFn: () => api.getAgentHealth(siteId) })
}

export function useRecommendationMutations() {
  const { siteId } = useSite()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['thermal'] })

  const log = useMutation({
    mutationFn: (input: NewRecommendationInput) => api.logRecommendation(siteId, input),
    onSuccess: () => {
      toast.success('Recommandation enregistrée')
      return invalidate()
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteRecommendation(siteId, id),
    onSuccess: () => {
      toast.success('Recommandation supprimée')
      return invalidate()
    },
  })

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: RecommendationPatch }) => api.updateRecommendation(siteId, id, patch),
    onSuccess: () => {
      toast.success('Modifications enregistrées')
      return invalidate()
    },
  })

  return { log, remove, update }
}
