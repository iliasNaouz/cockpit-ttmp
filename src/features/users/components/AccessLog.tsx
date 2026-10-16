import { LogIn, LogOut, Mail, ScrollText, ShieldAlert, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { EmptyState } from '@/components/shared/EmptyState'
import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect'
import { MonoValue } from '@/components/shared/MonoValue'
import { SearchInput } from '@/components/shared/SearchInput'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'
import { SITES } from '@/lib/sites'
import type { AccessLogType } from '@/types/auth'
import { useAccessLog } from '../hooks/useUsers'
import { DEFAULT_LOG_FILTERS, filterAccessLog, type LogFilters, type LogPeriod } from '../utils/user-filters'

const EVENTS: Record<AccessLogType, { label: string; icon: LucideIcon; color: string }> = {
  connexion: { label: 'Connexion', icon: LogIn, color: 'text-success' },
  deconnexion: { label: 'Déconnexion', icon: LogOut, color: 'text-ink-sub' },
  acces_refuse: { label: 'Accès refusé', icon: ShieldAlert, color: 'text-danger' },
  droits_modifies: { label: 'Droits modifiés', icon: ShieldCheck, color: 'text-brand' },
  invitation: { label: 'Invitation', icon: Mail, color: 'text-warning' },
}

const TYPE_OPTIONS: FilterOption<LogFilters['type']>[] = [
  { value: 'all', label: 'Tous' },
  ...(Object.keys(EVENTS) as AccessLogType[]).map((type) => ({ value: type, label: EVENTS[type].label })),
]
const PERIOD_OPTIONS: FilterOption<LogPeriod>[] = [
  { value: '24h', label: '24 dernières heures' },
  { value: '3d', label: '3 derniers jours' },
  { value: '7d', label: '7 derniers jours' },
]

export function AccessLog() {
  const { data } = useAccessLog()
  const [filters, setFilters] = useState<LogFilters>(DEFAULT_LOG_FILTERS)
  const entries = useMemo(() => filterAccessLog(data ?? [], filters), [data, filters])
  const update = <K extends keyof LogFilters>(key: K, value: LogFilters[K]) => setFilters((previous) => ({ ...previous, [key]: value }))

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <SearchInput value={filters.search} onChange={(value) => update('search', value)} placeholder="Rechercher un nom, un détail, une IP…" className="max-w-sm" />
        <FilterSelect label="Type" value={filters.type} options={TYPE_OPTIONS} onChange={(value) => update('type', value)} />
        <FilterSelect label="Période" value={filters.period} options={PERIOD_OPTIONS} onChange={(value) => update('period', value)} />
      </Card>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              {['Horodatage', 'Utilisateur', 'Évènement', 'Détail', 'Site', 'Adresse IP'].map((column) => (
                <TableHead key={column} className="h-10 text-[11px] font-bold uppercase tracking-wider text-ink-sub">{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const event = EVENTS[entry.type]
              return (
                <TableRow key={entry.id} className="h-11 border-line-soft hover:bg-page">
                  <TableCell><MonoValue className="text-xs text-ink-body">{formatDateTime(new Date(entry.timestamp))}</MonoValue></TableCell>
                  <TableCell><span className="flex items-center gap-2 text-[13px] text-ink"><UserAvatar name={entry.userName} size="sm" />{entry.userName}</span></TableCell>
                  <TableCell><span className="flex items-center gap-1.5 text-[13px] text-ink-body"><event.icon className={`size-4 ${event.color}`} aria-hidden />{event.label}</span></TableCell>
                  <TableCell className="text-[13px] text-ink-body">{entry.detail}</TableCell>
                  <TableCell className="text-xs text-ink-sub">{entry.site ? SITES[entry.site].label : '—'}</TableCell>
                  <TableCell><MonoValue className="text-xs text-ink-mute">{entry.ip}</MonoValue></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {entries.length === 0 && <EmptyState icon={ScrollText} title="Aucun évènement" description="Aucune entrée ne correspond aux filtres." />}
      </Card>
    </div>
  )
}
