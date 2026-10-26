import { CloudFog, Flame, LayoutGrid, Rows3, Settings, Wind, Wrench, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { SegmentedTabs, type TabOption } from '@/components/shared/SegmentedTabs'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { LeverGroup } from '@/types/lever-history'
import type { GroupFilter, HistoryFilters, HistoryPeriod, HistoryView } from '../hooks/useHistoryFilters'

const PERIOD_OPTIONS: TabOption<HistoryPeriod>[] = [
  { value: '6h', label: '6 h' },
  { value: '24h', label: '24 h' },
  { value: '7j', label: '7 j' },
  { value: 'perso', label: 'Perso' },
]

const VIEW_OPTIONS: TabOption<HistoryView>[] = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'matrice', label: 'Matrice' },
]

const GROUP_ICONS: Record<LeverGroup, LucideIcon> = {
  alimentateurs: Wrench,
  grilles: Settings,
  air: Wind,
  combustion: Flame,
  vapeur: CloudFog,
}

const GROUPS: Array<{ value: GroupFilter; label: string; icon?: LucideIcon }> = [
  { value: 'all', label: 'Tous' },
  { value: 'alimentateurs', label: 'Alim.', icon: GROUP_ICONS.alimentateurs },
  { value: 'grilles', label: 'Grilles', icon: GROUP_ICONS.grilles },
  { value: 'air', label: 'Air', icon: GROUP_ICONS.air },
  { value: 'combustion', label: 'Comb.', icon: GROUP_ICONS.combustion },
  { value: 'vapeur', label: 'Vap.', icon: GROUP_ICONS.vapeur },
]

interface HistoryToolbarProps {
  filters: HistoryFilters
  onChange: (patch: Partial<HistoryFilters>) => void
}

/** Barre d'outils : période, groupe, interrupteurs d'affichage et bascule Timeline / Matrice. */
export function HistoryToolbar({ filters, onChange }: HistoryToolbarProps) {
  return (
    <Card className="flex shrink-0 flex-wrap items-center gap-3 rounded-2xl px-3 py-2">
      <SegmentedTabs options={PERIOD_OPTIONS} value={filters.period} onChange={(period) => onChange({ period })} ariaLabel="Période" />

      <div role="tablist" aria-label="Groupe de leviers" className="inline-flex gap-0.5 rounded-lg bg-surface-muted p-0.5">
        {GROUPS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filters.group === value}
            onClick={() => onChange({ group: value })}
            className={cn(
              'flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-brand',
              filters.group === value ? 'bg-surface font-semibold text-brand-hover shadow-tab' : 'text-ink-sub hover:text-ink-body',
            )}
          >
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs text-ink-body">
          <Switch checked={filters.showRecos} onCheckedChange={(showRecos) => onChange({ showRecos })} />
          Recos
        </label>
        <label className="flex items-center gap-1.5 text-xs text-ink-body">
          <Switch checked={filters.showEffects} onCheckedChange={(showEffects) => onChange({ showEffects })} />
          Effets
        </label>
        <label className="flex items-center gap-1.5 text-xs text-ink-body">
          <Switch checked={filters.changesOnly} onCheckedChange={(changesOnly) => onChange({ changesOnly })} />
          Changements seuls
        </label>
      </div>

      <div className="ml-auto flex items-center gap-1 text-ink-sub">
        <Rows3 className="size-4" aria-hidden />
        <SegmentedTabs options={VIEW_OPTIONS} value={filters.view} onChange={(view) => onChange({ view })} ariaLabel="Vue" />
        <LayoutGrid className="size-4" aria-hidden />
      </div>
    </Card>
  )
}
