import { describe, expect, it } from 'vitest'
import { buildAccessLog } from '@/data/mock/access-log'
import { USERS } from '@/data/mock/users'
import {
  DEFAULT_LOG_FILTERS,
  DEFAULT_USER_FILTERS,
  computeUserKpis,
  filterAccessLog,
  filterUsers,
  paginate,
} from './user-filters'

describe('computeUserKpis', () => {
  it('compte 12 utilisateurs dont 9 actifs, 2 invités et 1 désactivé', () => {
    expect(computeUserKpis(USERS)).toEqual({ total: 12, active: 9, invited: 2, disabled: 1 })
  })
})

describe('filterUsers', () => {
  it('retourne tout sans filtre', () => {
    expect(filterUsers(USERS, DEFAULT_USER_FILTERS)).toHaveLength(12)
  })

  it('recherche dans le nom et l’email', () => {
    expect(filterUsers(USERS, { ...DEFAULT_USER_FILTERS, search: 'benali' })).toHaveLength(1)
    expect(filterUsers(USERS, { ...DEFAULT_USER_FILTERS, search: 'CHEF@' })).toHaveLength(1)
  })

  it('filtre par rôle et statut', () => {
    expect(filterUsers(USERS, { ...DEFAULT_USER_FILTERS, role: 'lecteur' })).toHaveLength(3)
    expect(filterUsers(USERS, { ...DEFAULT_USER_FILTERS, status: 'invite' })).toHaveLength(2)
  })

  it('inclut les administrateurs dans tous les sites', () => {
    const rouen = filterUsers(USERS, { ...DEFAULT_USER_FILTERS, site: 'rouen' })
    expect(rouen.some((user) => user.role === 'administrateur')).toBe(true)
    expect(rouen.every((user) => user.role === 'administrateur' || user.sites.includes('rouen'))).toBe(true)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 12 }, (_, index) => index)

  it('pagine 12 éléments en 10 + 2', () => {
    const first = paginate(items, 1)
    expect(first.items).toHaveLength(10)
    expect([first.from, first.to, first.pageCount]).toEqual([1, 10, 2])
    const second = paginate(items, 2)
    expect(second.items).toHaveLength(2)
    expect([second.from, second.to]).toEqual([11, 12])
  })

  it('ramène une page hors limites dans l’intervalle', () => {
    expect(paginate(items, 99).page).toBe(2)
    expect(paginate(items, -3).page).toBe(1)
  })

  it('gère une liste vide', () => {
    const empty = paginate([], 1)
    expect([empty.from, empty.to, empty.pageCount]).toEqual([0, 0, 1])
  })
})

describe('filterAccessLog', () => {
  const now = Date.now()
  const log = buildAccessLog(now)

  it('contient 30 entrées sur 7 jours', () => {
    expect(log).toHaveLength(30)
    expect(filterAccessLog(log, DEFAULT_LOG_FILTERS, now)).toHaveLength(30)
  })

  it('filtre par type et par période', () => {
    const denied = filterAccessLog(log, { ...DEFAULT_LOG_FILTERS, type: 'acces_refuse' }, now)
    expect(denied.length).toBeGreaterThan(0)
    expect(denied.every((entry) => entry.type === 'acces_refuse')).toBe(true)
    const lastDay = filterAccessLog(log, { ...DEFAULT_LOG_FILTERS, period: '24h' }, now)
    expect(lastDay.length).toBeLessThan(30)
  })

  it('recherche dans le nom et le détail', () => {
    expect(filterAccessLog(log, { ...DEFAULT_LOG_FILTERS, search: '/utilisateurs' }, now).length).toBeGreaterThan(0)
    expect(filterAccessLog(log, { ...DEFAULT_LOG_FILTERS, search: 'zzzz' }, now)).toHaveLength(0)
  })
})
