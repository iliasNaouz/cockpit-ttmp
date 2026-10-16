import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/auth-store'
import { getAllowedSites } from '@/auth/permissions'
import * as api from '@/data/services/api'
import type { NewMilestoneInput } from '@/data/services/api'
import type { SiteId } from '@/types/domain'
import type { TaskStatus } from '@/types/project'

/** Projets des sites autorisés pour l'utilisateur connecté. */
export function useProjects() {
  const { user } = useAuth()
  const siteIds = getAllowedSites(user)
  return useQuery({ queryKey: ['projects', 'list', siteIds], queryFn: () => api.listProjects(siteIds) })
}

export function useProject(siteId: SiteId) {
  return useQuery({ queryKey: ['projects', 'detail', siteId], queryFn: () => api.getProject(siteId) })
}

export function useProjectMutations(siteId: SiteId) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] })

  const moveTask = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) => api.moveTask(siteId, taskId, status),
    onSuccess: invalidate,
  })
  const addTask = useMutation({
    mutationFn: ({ status, title }: { status: TaskStatus; title: string }) => api.addTask(siteId, status, title),
    onSuccess: invalidate,
  })
  const addMilestone = useMutation({
    mutationFn: (input: NewMilestoneInput) => api.addMilestone(siteId, input),
    onSuccess: invalidate,
  })

  return { moveTask, addTask, addMilestone }
}
