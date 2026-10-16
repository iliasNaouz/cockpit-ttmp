import { Card } from '@/components/shared/Card'
import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect'
import { MonoValue } from '@/components/shared/MonoValue'
import { SearchInput } from '@/components/shared/SearchInput'
import { ROLE_LABELS, ROLE_ORDER } from '@/design-system/role-styles'
import { USER_STATUS_STYLES } from '@/design-system/status-styles'
import { SITES, SITE_IDS } from '@/lib/sites'
import type { UserFilters as Filters } from '../utils/user-filters'

const ROLE_OPTIONS: FilterOption<Filters['role']>[] = [
  { value: 'all', label: 'Tous' },
  ...ROLE_ORDER.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
]
const SITE_OPTIONS: FilterOption<Filters['site']>[] = [
  { value: 'all', label: 'Tous' },
  ...SITE_IDS.map((id) => ({ value: id, label: SITES[id].label })),
]
const STATUS_OPTIONS: FilterOption<Filters['status']>[] = [
  { value: 'all', label: 'Tous' },
  ...(['actif', 'invite', 'desactive'] as const).map((status) => ({ value: status, label: USER_STATUS_STYLES[status].label })),
]

interface UserFiltersProps {
  filters: Filters
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  count: number
}

export function UserFilters({ filters, onChange, count }: UserFiltersProps) {
  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <SearchInput value={filters.search} onChange={(value) => onChange('search', value)} placeholder="Rechercher un nom, un email…" className="max-w-sm" />
      <FilterSelect label="Rôle" value={filters.role} options={ROLE_OPTIONS} onChange={(value) => onChange('role', value)} />
      <FilterSelect label="Site" value={filters.site} options={SITE_OPTIONS} onChange={(value) => onChange('site', value)} />
      <FilterSelect label="Statut" value={filters.status} options={STATUS_OPTIONS} onChange={(value) => onChange('status', value)} />
      <p className="ml-auto text-xs text-ink-sub">
        <MonoValue className="font-bold text-ink">{count}</MonoValue> utilisateur{count > 1 ? 's' : ''}
      </p>
    </Card>
  )
}
