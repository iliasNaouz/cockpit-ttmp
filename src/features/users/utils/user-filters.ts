import type { AccessLogEntry, AccessLogType, Role, User, UserStatus } from '@/types/auth'
import type { SiteId } from '@/types/domain'

export interface UserFilters {
  search: string
  role: 'all' | Role
  site: 'all' | SiteId
  status: 'all' | UserStatus
}

export const DEFAULT_USER_FILTERS: UserFilters = { search: '', role: 'all', site: 'all', status: 'all' }

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`
}

export function filterUsers(users: User[], filters: UserFilters): User[] {
  const query = filters.search.trim().toLowerCase()
  return users.filter((user) => {
    if (query !== '' && !`${fullName(user)} ${user.email}`.toLowerCase().includes(query)) return false
    if (filters.role !== 'all' && user.role !== filters.role) return false
    if (filters.site !== 'all' && !(user.role === 'administrateur' || user.sites.includes(filters.site))) return false
    if (filters.status !== 'all' && user.status !== filters.status) return false
    return true
  })
}

export interface UserKpis {
  total: number
  active: number
  invited: number
  disabled: number
}

export function computeUserKpis(users: User[]): UserKpis {
  const count = (status: UserStatus) => users.filter((user) => user.status === status).length
  return { total: users.length, active: count('actif'), invited: count('invite'), disabled: count('desactive') }
}

export const PAGE_SIZE = 10

export interface Page<T> {
  items: T[]
  page: number
  pageCount: number
  /** Index (1-based) du premier et du dernier élément affichés, 0 si vide. */
  from: number
  to: number
}

/** Pagination bornée : une page hors limites est ramenée dans l'intervalle valide. */
export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * size
  const slice = items.slice(start, start + size)
  return {
    items: slice,
    page: current,
    pageCount,
    from: slice.length === 0 ? 0 : start + 1,
    to: start + slice.length,
  }
}

export type LogPeriod = '24h' | '3d' | '7d'
export interface LogFilters {
  search: string
  type: 'all' | AccessLogType
  period: LogPeriod
}

export const DEFAULT_LOG_FILTERS: LogFilters = { search: '', type: 'all', period: '7d' }

const PERIOD_MS: Record<LogPeriod, number> = { '24h': 86_400_000, '3d': 3 * 86_400_000, '7d': 7 * 86_400_000 }

export function filterAccessLog(entries: AccessLogEntry[], filters: LogFilters, now: number = Date.now()): AccessLogEntry[] {
  const query = filters.search.trim().toLowerCase()
  return entries.filter((entry) => {
    if (now - new Date(entry.timestamp).getTime() > PERIOD_MS[filters.period]) return false
    if (filters.type !== 'all' && entry.type !== filters.type) return false
    if (query !== '' && !`${entry.userName} ${entry.detail} ${entry.ip}`.toLowerCase().includes(query)) return false
    return true
  })
}
