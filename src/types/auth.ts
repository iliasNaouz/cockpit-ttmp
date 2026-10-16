import type { SiteId } from './domain'

export type Role = 'administrateur' | 'chef_projet' | 'operateur' | 'lecteur'

export type ModuleId = 'ttmp' | 'thermal' | 'chat' | 'projets' | 'utilisateurs'

export type AccessLevel = 'aucun' | 'lecture' | 'ecriture'

export type UserStatus = 'actif' | 'invite' | 'desactive'

export type AccessOverrides = Partial<Record<ModuleId, AccessLevel>>

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  sites: SiteId[]
  overrides: AccessOverrides
  status: UserStatus
  /** ISO 8601 ou null si jamais connecté */
  lastLoginAt: string | null
}

/** Session conservée côté navigateur : jamais de mot de passe. */
export interface Session {
  user: User
  createdAt: string
}

export type AccessLogType =
  | 'connexion'
  | 'deconnexion'
  | 'acces_refuse'
  | 'droits_modifies'
  | 'invitation'

export interface AccessLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  type: AccessLogType
  detail: string
  site: SiteId | null
  ip: string
}
