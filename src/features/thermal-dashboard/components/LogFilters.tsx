import { Card } from '@/components/shared/Card'
import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect'
import { MonoValue } from '@/components/shared/MonoValue'
import { SearchInput } from '@/components/shared/SearchInput'
import { StatusDot } from '@/components/shared/StatusDot'
import { LEVER_ORDER } from '@/design-system/lever-styles'
import type { ActionFilter, LeverFilter, LogFilters as Filters, O2Filter, OutputFilter } from '../utils/log-filters'
import { LogRecommendationDialog } from './LogRecommendationDialog'

const LEVER_OPTIONS: FilterOption<LeverFilter>[] = [
  { value: 'all', label: 'All Levers' },
  ...LEVER_ORDER.map((lever) => ({ value: lever, label: lever })),
  { value: 'Timeout Error', label: 'Timeout Error' },
]
const ACTION_OPTIONS: FilterOption<ActionFilter>[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'Up', label: 'Up' },
  { value: 'Down', label: 'Down' },
  { value: 'Hold', label: 'Hold' },
]
const O2_OPTIONS: FilterOption<O2Filter>[] = [
  { value: 'all', label: 'All O₂' },
  { value: 'safe', label: 'Safe (<6.5%)' },
  { value: 'near', label: 'Proche seuil (6.5–7%)' },
  { value: 'alert', label: 'Alerte (≥7%)' },
]
const OUTPUT_OPTIONS: FilterOption<OutputFilter>[] = [
  { value: 'all', label: 'All Output' },
  { value: 'above', label: 'Au-dessus de 40' },
  { value: 'below', label: 'Sous 40' },
]

interface LogFiltersProps {
  filters: Filters
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  shown: number
  total: number
}

export function LogFilters({ filters, onChange, shown, total }: LogFiltersProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={filters.search} onChange={(value) => onChange('search', value)} placeholder="Search timestamps, levers, tags" className="max-w-sm" />
        <FilterSelect label="Lever" value={filters.lever} options={LEVER_OPTIONS} onChange={(value) => onChange('lever', value)} />
        <FilterSelect label="Action" value={filters.action} options={ACTION_OPTIONS} onChange={(value) => onChange('action', value)} />
        <FilterSelect label="O₂ Level" value={filters.o2} options={O2_OPTIONS} onChange={(value) => onChange('o2', value)} />
        <FilterSelect label="Steam vs 40 t/h" value={filters.output} options={OUTPUT_OPTIONS} onChange={(value) => onChange('output', value)} />
        <div className="ml-auto">
          <LogRecommendationDialog />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-sub">
        <p>
          Showing <MonoValue className="font-bold text-ink">{shown}</MonoValue> of <MonoValue className="font-bold text-ink">{total}</MonoValue> operational logs
        </p>
        <p className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><StatusDot tone="success" /> Safe (&lt;7% O₂)</span>
          <span className="flex items-center gap-1.5"><StatusDot tone="danger" /> Threshold Alert (≥7% O₂)</span>
        </p>
      </div>
    </Card>
  )
}
