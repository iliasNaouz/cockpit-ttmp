import { useMemo, useState } from 'react'
import { Cpu, User } from 'lucide-react'
import { MonoValue } from '@/components/shared/MonoValue'
import { CHANGE_ORIGIN_STYLES, RECO_OUTCOME_STYLES } from '@/design-system/history-styles'
import { cn } from '@/lib/utils'
import { formatHour } from '../utils/timeline-scale'
import type { DerivedHistory } from '../hooks/useLeverHistory'
import type { RecoOutcome } from '@/types/lever-history'

type JournalFilter = 'all' | RecoOutcome | 'initiatives'

const FILTERS: Array<{ value: JournalFilter; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'suivie', label: 'Suivies' },
  { value: 'partielle', label: 'Partielles' },
  { value: 'contraire', label: 'Contraires' },
  { value: 'ignoree', label: 'Ignorées' },
  { value: 'initiatives', label: 'Initiatives' },
]

interface ChangeJournalProps {
  derived: DerivedHistory
  onSelect: (changeId: string) => void
}

/** Journal des changements : liste chronologique filtrable, la plus récente en haut. */
export function ChangeJournal({ derived, onSelect }: ChangeJournalProps) {
  const [filter, setFilter] = useState<JournalFilter>('all')
  const { data, origins, outcomeByChange, effects } = derived
  const labelOf = (id: string) => data.defs.find((def) => def.id === id)?.label ?? id

  const rows = useMemo(() => {
    return [...data.changes]
      .sort((a, b) => b.t.localeCompare(a.t))
      .filter((change) => {
        const origin = origins.get(change.id) ?? 'initiative'
        const outcome = outcomeByChange.get(change.id)
        if (filter === 'all') return true
        if (filter === 'initiatives') return origin === 'initiative'
        return outcome === filter
      })
  }, [data.changes, origins, outcomeByChange, filter])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-line p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-ink">Journal</h2>
          <span className="text-[11px] text-ink-mute">{rows.length} changements</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[11px] transition-colors',
                filter === value ? 'border-brand bg-brand-soft text-brand' : 'border-line text-ink-sub hover:text-ink-body',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-2">
        {rows.map((change) => {
          const origin = origins.get(change.id) ?? 'initiative'
          const outcome = outcomeByChange.get(change.id)
          const style = outcome ? RECO_OUTCOME_STYLES[outcome] : CHANGE_ORIGIN_STYLES[origin]
          const effect = effects.get(change.id)
          const Icon = change.source === 'operateur' ? User : Cpu
          return (
            <li key={change.id}>
              <button
                type="button"
                onClick={() => onSelect(change.id)}
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-surface-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <MonoValue className="text-[11px] text-ink-mute">{formatHour(Date.parse(change.t))}</MonoValue>
                    <span className="text-[13px] font-semibold text-ink">{labelOf(change.leverId)}</span>
                  </span>
                  <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-semibold', style.pill)}>{style.label}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <MonoValue className="text-[11px] text-ink-sub">
                    {change.from} → {change.to}{' '}
                    <span className={change.delta >= 0 ? 'text-success' : 'text-danger'}>
                      ({change.delta >= 0 ? '+' : ''}
                      {change.delta})
                    </span>
                  </MonoValue>
                  <Icon className="size-3 text-ink-mute" aria-hidden />
                </div>
                {effect && (
                  <MonoValue className="mt-0.5 block text-[10px] text-ink-mute">
                    Vapeur {effect.steamDelta15 >= 0 ? '+' : ''}{effect.steamDelta15} · O₂ {effect.o2Delta15 >= 0 ? '+' : ''}{effect.o2Delta15} à +15 min
                  </MonoValue>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
