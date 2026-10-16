import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth, useCurrentUser } from '@/auth/auth-store'
import * as api from '@/data/services/api'
import type { InviteUserInput, UpdateAccessInput } from '@/data/services/api'
import type { UserStatus } from '@/types/auth'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.listUsers })
}

export function useAccessLog() {
  return useQuery({ queryKey: ['access-log'], queryFn: api.getAccessLog })
}

/** Mutations de gestion des utilisateurs ; chaque action est journalisée côté API. */
export function useUserMutations() {
  const actor = useCurrentUser()
  const { updateSessionUser } = useAuth()
  const queryClient = useQueryClient()
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users'] }),
      queryClient.invalidateQueries({ queryKey: ['access-log'] }),
    ])

  const onError = (error: Error) => toast.error(error.message)

  const invite = useMutation({
    mutationFn: (input: InviteUserInput) => api.inviteUser(input, actor),
    onSuccess: (user) => {
      toast.success(`Invitation envoyée à ${user.email}`)
      return refresh()
    },
    onError,
  })

  const updateAccess = useMutation({
    mutationFn: ({ userId, patch }: { userId: string; patch: UpdateAccessInput }) => api.updateUserAccess(userId, patch, actor),
    onSuccess: (user) => {
      toast.success('Droits mis à jour')
      if (user.id === actor.id) updateSessionUser(user)
      return refresh()
    },
    onError,
  })

  const setStatus = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: Extract<UserStatus, 'actif' | 'desactive'> }) => api.setUserStatus(userId, status, actor),
    onSuccess: (_, { status }) => {
      toast.success(status === 'actif' ? 'Compte réactivé' : 'Compte désactivé')
      return refresh()
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (userId: string) => api.deleteUser(userId, actor),
    onSuccess: () => {
      toast.success('Compte supprimé')
      return refresh()
    },
    onError,
  })

  const resendInvitation = useMutation({
    mutationFn: (userId: string) => api.resendInvitation(userId, actor),
    onSuccess: () => {
      toast.success('Invitation renvoyée')
      return refresh()
    },
    onError,
  })

  const resetPassword = useMutation({
    mutationFn: (userId: string) => api.resetPassword(userId),
    onSuccess: () => toast.success('Lien de réinitialisation envoyé'),
    onError,
  })

  return { invite, updateAccess, setStatus, remove, resendInvitation, resetPassword }
}
