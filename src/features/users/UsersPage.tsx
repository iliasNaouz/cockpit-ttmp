import { useMemo, useState } from 'react'
import { SegmentedTabs, type TabOption } from '@/components/shared/SegmentedTabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessLog } from './components/AccessLog'
import { InviteUserDialog } from './components/InviteUserDialog'
import { RolesMatrix } from './components/RolesMatrix'
import { UserFilters } from './components/UserFilters'
import { UsersKpis } from './components/UsersKpis'
import { UsersTable } from './components/UsersTable'
import { useUsers } from './hooks/useUsers'
import { DEFAULT_USER_FILTERS, filterUsers, type UserFilters as Filters } from './utils/user-filters'

type Tab = 'utilisateurs' | 'roles' | 'journal'

const TABS: TabOption<Tab>[] = [
  { value: 'utilisateurs', label: 'Utilisateurs' },
  { value: 'roles', label: 'Rôles & permissions' },
  { value: 'journal', label: "Journal d'accès" },
]

export function UsersPage() {
  const { data } = useUsers()
  const [tab, setTab] = useState<Tab>('utilisateurs')
  const [filters, setFilters] = useState<Filters>(DEFAULT_USER_FILTERS)
  const users = useMemo(() => data ?? [], [data])
  const filtered = useMemo(() => filterUsers(users, filters), [users, filters])
  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((previous) => ({ ...previous, [key]: value }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Gestion des utilisateurs</h2>
          <p className="mt-0.5 text-[13px] text-ink-sub">Gérez les comptes, les rôles et l'accès de chaque personne aux sites et aux modules de l'outil.</p>
        </div>
        <InviteUserDialog />
      </div>

      <UsersKpis users={users} />
      <SegmentedTabs options={TABS} value={tab} onChange={setTab} ariaLabel="Sections de gestion des utilisateurs" />

      {!data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div role="tabpanel" className="space-y-4">
          {tab === 'utilisateurs' && (
            <>
              <UserFilters filters={filters} onChange={setFilter} count={filtered.length} />
              <UsersTable users={filtered} />
            </>
          )}
          {tab === 'roles' && <RolesMatrix users={users} />}
          {tab === 'journal' && <AccessLog />}
        </div>
      )}
    </div>
  )
}
