import { describe, expect, it } from 'vitest'
import type { Role, User } from '@/types/auth'
import {
  ACCESS_DENIED_ROUTE,
  can,
  canAccessSite,
  firstAllowedRoute,
  getAccessLevel,
  getAllowedSites,
  getVisibleModules,
  hasOverride,
  normalizeOverrides,
} from './permissions'

function makeUser(role: Role, overrides: User['overrides'] = {}, sites: User['sites'] = ['begles']): User {
  return {
    id: 'u-test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@demo.fr',
    role,
    sites,
    overrides,
    status: 'actif',
    lastLoginAt: null,
  }
}

describe('getAccessLevel', () => {
  it('renvoie le défaut du rôle sans surcharge', () => {
    expect(getAccessLevel(makeUser('operateur'), 'ttmp')).toBe('ecriture')
    expect(getAccessLevel(makeUser('lecteur'), 'ttmp')).toBe('lecture')
    expect(getAccessLevel(makeUser('lecteur'), 'chat')).toBe('aucun')
    expect(getAccessLevel(makeUser('chef_projet'), 'utilisateurs')).toBe('aucun')
  })

  it('applique la surcharge quand elle existe', () => {
    const user = makeUser('operateur', { projets: 'ecriture', ttmp: 'aucun' })
    expect(getAccessLevel(user, 'projets')).toBe('ecriture')
    expect(getAccessLevel(user, 'ttmp')).toBe('aucun')
  })
})

describe('can', () => {
  it('considère ecriture comme couvrant lecture', () => {
    const admin = makeUser('administrateur')
    expect(can(admin, 'utilisateurs', 'lecture')).toBe(true)
    expect(can(admin, 'utilisateurs', 'ecriture')).toBe(true)
  })

  it('refuse l’écriture à un accès en lecture seule', () => {
    const lecteur = makeUser('lecteur')
    expect(can(lecteur, 'ttmp', 'lecture')).toBe(true)
    expect(can(lecteur, 'ttmp', 'ecriture')).toBe(false)
  })

  it('refuse tout quand le niveau est aucun ou sans utilisateur', () => {
    expect(can(makeUser('lecteur'), 'chat', 'lecture')).toBe(false)
    expect(can(null, 'ttmp', 'lecture')).toBe(false)
    expect(can(undefined, 'ttmp', 'lecture')).toBe(false)
  })
})

describe('canAccessSite', () => {
  it('limite aux sites de l’utilisateur', () => {
    const user = makeUser('operateur', {}, ['begles'])
    expect(canAccessSite(user, 'begles')).toBe(true)
    expect(canAccessSite(user, 'rouen')).toBe(false)
  })

  it('donne tous les sites à un administrateur', () => {
    const admin = makeUser('administrateur', {}, [])
    expect(canAccessSite(admin, 'rouen')).toBe(true)
    expect(getAllowedSites(admin)).toEqual(['rouen', 'begles'])
  })

  it('refuse sans utilisateur', () => {
    expect(canAccessSite(null, 'rouen')).toBe(false)
  })
})

describe('modules visibles et routes', () => {
  it('masque Utilisateurs pour un opérateur', () => {
    expect(getVisibleModules(makeUser('operateur'))).toEqual(['ttmp', 'thermal', 'historique', 'chat', 'projets'])
  })

  it('masque Chat pour un lecteur', () => {
    expect(getVisibleModules(makeUser('lecteur'))).toEqual(['ttmp', 'thermal', 'historique', 'projets'])
  })

  it('redirige vers le premier module autorisé', () => {
    expect(firstAllowedRoute(makeUser('operateur'))).toBe('/ttmp')
    expect(firstAllowedRoute(makeUser('chef_projet', { ttmp: 'aucun', thermal: 'aucun', historique: 'aucun' }))).toBe('/chat')
  })

  it('renvoie la page d’accès refusé sans aucun module', () => {
    const none = makeUser('lecteur', { ttmp: 'aucun', thermal: 'aucun', historique: 'aucun', projets: 'aucun' })
    expect(firstAllowedRoute(none)).toBe(ACCESS_DENIED_ROUTE)
  })
})

describe('surcharges', () => {
  it('détecte une surcharge différente du défaut', () => {
    const user = makeUser('operateur', { projets: 'ecriture', ttmp: 'ecriture' })
    expect(hasOverride(user, 'projets')).toBe(true)
    expect(hasOverride(user, 'ttmp')).toBe(false)
  })

  it('retire les surcharges égales au défaut', () => {
    expect(normalizeOverrides('operateur', { projets: 'ecriture', ttmp: 'ecriture' })).toEqual({
      projets: 'ecriture',
    })
  })
})
