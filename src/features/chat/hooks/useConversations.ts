import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '@/data/services/api'
import type { SiteId } from '@/types/domain'

export const CONVERSATIONS_KEY = ['chat', 'conversations'] as const

export function useConversations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })

  const list = useQuery({ queryKey: CONVERSATIONS_KEY, queryFn: api.listConversations })

  const create = useMutation({
    mutationFn: (siteId: SiteId) => api.createConversation(siteId),
    onSuccess: invalidate,
  })
  const rename = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => api.renameConversation(id, title),
    onSuccess: invalidate,
  })
  const togglePin = useMutation({ mutationFn: (id: string) => api.togglePinConversation(id), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: string) => api.deleteConversation(id), onSuccess: invalidate })

  return { conversations: list.data ?? [], isLoading: list.isLoading, create, rename, togglePin, remove, invalidate }
}
