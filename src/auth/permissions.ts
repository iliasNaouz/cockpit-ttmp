import { SITE_IDS } from '@/lib/sites'
import type { AccessLevel, AccessOverrides, ModuleId, Role, User } from '@/types/auth'
import type { SiteId } from '@/types/domain'
import { MODULE_ORDER, MODULES } from './modules'

/**
 * Contrôles d'accès côté front : ergonomie uniquement.
 * La vraie API doit revérifier chaque droit côté serveur.
 */

export const ROLE_DEFAULTS: Record<Role, Record<ModuleId, AccessLevel>> = {
  administrateur: {
    ttmp: 'ecriture',
    thermal: 'ecriture',
    historique: 'ecriture',
    chat: 'ecriture',
    projets: 'ecriture',
    utilisateurs: 'ecriture',
  },
  chef_projet: {
    ttmp: 'lecture',
    thermal: 'lecture',
    historique: 'lecture',
    chat: 'ecriture',
    projets: 'ecriture',
    utilisateurs: 'aucun',
  },
  operateur: {
    ttmp: 'ecriture',
    thermal: 'ecriture',
    historique: 'ecriture',
    chat: 'ecriture',
    projets: 'lecture',
    utilisateurs: 'aucun',
  },
  lecteur: {
    ttmp: 'lecture',
    thermal: 'lecture',
    historique: 'lecture',
    chat: 'aucun',
    projets: 'lecture',
    utilisateurs: 'aucun',
  },
}

const LEVEL_RANK: Record<AccessLevel, number> = { aucun: 0, lecture: 1, ecriture: 2 }

export function getRoleDefault(role: Role, module: ModuleId): AccessLevel {
  return ROLE_DEFAULTS[role][module]
}

/** Accès effectif : surcharge si elle existe, sinon défaut du rôle. */
export function getAccessLevel(user: Pick<User, 'role' | 'overrides'>, module: ModuleId): AccessLevel {
  return user.overrides[module] ?? getRoleDefault(user.role, module)
}

/** `ecriture` couvre `lecture`. */
export function can(
  user: Pick<User, 'role' | 'overrides'> | null | undefined,
  module: ModuleId,
  required: 'lecture' | 'ecriture',
): boolean {
  if (!user) return false
  return LEVEL_RANK[getAccessLevel(user, module)] >= LEVEL_RANK[required]
}

/** Les administrateurs ont accès à tous les sites. */
export function canAccessSite(
  user: Pick<User, 'role' | 'sites'> | null | undefined,
  siteId: SiteId,
): boolean {
  if (!user) return false
  return user.role === 'administrateur' || user.sites.includes(siteId)
}

export function getAllowedSites(user: Pick<User, 'role' | 'sites'> | null | undefined): SiteId[] {
  return SITE_IDS.filter((siteId) => canAccessSite(user, siteId))
}

export function hasOverride(user: Pick<User, 'role' | 'overrides'>, module: ModuleId): boolean {
  const override = user.overrides[module]
  return override !== undefined && override !== getRoleDefault(user.role, module)
}

/** Retire les surcharges identiques au défaut du rôle. */
export function normalizeOverrides(role: Role, overrides: AccessOverrides): AccessOverrides {
  const result: AccessOverrides = {}
  for (const module of MODULE_ORDER) {
    const value = overrides[module]
    if (value !== undefined && value !== getRoleDefault(role, module)) {
      result[module] = value
    }
  }
  return result
}

export function getVisibleModules(user: Pick<User, 'role' | 'overrides'> | null | undefined): ModuleId[] {
  return MODULE_ORDER.filter((module) => can(user, module, 'lecture'))
}

export const ACCESS_DENIED_ROUTE = '/acces-refuse'

/** Route du premier module autorisé, sinon la page d'accès refusé. */
export function firstAllowedRoute(user: Pick<User, 'role' | 'overrides'> | null | undefined): string {
  const first = getVisibleModules(user)[0]
  return first ? MODULES[first].route : ACCESS_DENIED_ROUTE
}
