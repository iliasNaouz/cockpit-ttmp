import type { AccessLevel, ModuleId } from '@/types/auth'
import { useAuth } from './auth-store'
import { can, getAccessLevel } from './permissions'

export interface PermissionState {
  level: AccessLevel
  canRead: boolean
  canWrite: boolean
}

/** Droits de l'utilisateur connecté sur un module (ergonomie uniquement). */
export function usePermission(module: ModuleId): PermissionState {
  const { user } = useAuth()
  return {
    level: user ? getAccessLevel(user, module) : 'aucun',
    canRead: can(user, module, 'lecture'),
    canWrite: can(user, module, 'ecriture'),
  }
}

export const READ_ONLY_TOOLTIP = 'Accès en lecture seule'
