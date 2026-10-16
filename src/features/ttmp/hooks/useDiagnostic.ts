import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSite } from '@/contexts/site-store'
import * as api from '@/data/services/api'

export function useDiagnostic() {
  const { siteId } = useSite()
  const queryClient = useQueryClient()
  const queryKey = ['ttmp', 'diagnostic', siteId] as const

  const query = useQuery({ queryKey, queryFn: () => api.getDiagnostic(siteId) })

  const refresh = useMutation({
    mutationFn: () => api.getDiagnostic(siteId, true),
    onSuccess: (fresh) => queryClient.setQueryData(queryKey, fresh),
  })

  return {
    diagnostic: query.data,
    isLoading: query.isLoading || refresh.isPending,
    refresh: refresh.mutate,
  }
}
