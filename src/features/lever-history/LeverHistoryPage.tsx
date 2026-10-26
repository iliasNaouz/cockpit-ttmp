import { useMemo, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChangeDetailSheet } from './components/ChangeDetailSheet'
import { ChangeJournal } from './components/ChangeJournal'
import { HistoryKpis, type KpiFilter } from './components/HistoryKpis'
import { HistoryToolbar } from './components/HistoryToolbar'
import { LeverHeatmap } from './components/LeverHeatmap'
import { LeverTimeline } from './components/LeverTimeline'
import { useHistoryFilters } from './hooks/useHistoryFilters'
import { useLeverHistory } from './hooks/useLeverHistory'
import { resolveWindow } from './utils/time-window'

/** Page « Historique des leviers » : barre d'outils, KPI, timeline/matrice et journal. */
export function LeverHistoryPage() {
  const { filters, update } = useHistoryFilters()
  const window = useMemo(() => resolveWindow(filters), [filters])
  const { derived, isLoading } = useLeverHistory(window.from, window.to)
  const [kpiFilter, setKpiFilter] = useState<KpiFilter>('all')
  const [selected, setSelected] = useState<string | null>(null)

  // Leviers visibles selon groupe, sélection explicite et « changements seuls ».
  const leverIds = useMemo(() => {
    if (!derived) return []
    return derived.data.defs
      .filter((def) => filters.group === 'all' || def.group === filters.group)
      .filter((def) => filters.levers.length === 0 || filters.levers.includes(def.id))
      .filter((def) => !filters.changesOnly || derived.data.changes.some((change) => change.leverId === def.id))
      .map((def) => def.id)
  }, [derived, filters.group, filters.levers, filters.changesOnly])

  return (
    <div className="flex h-dvh flex-col gap-3 p-4">
      <HistoryToolbar filters={filters} onChange={update} />

      {isLoading || !derived ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <HistoryKpis summary={derived.summary} active={kpiFilter} onFilter={setKpiFilter} />
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[1fr_360px]">
        <Card className="min-h-0 overflow-hidden rounded-2xl">
          {isLoading || !derived ? (
            <Skeleton className="h-full w-full" />
          ) : filters.view === 'timeline' ? (
            <LeverTimeline derived={derived} leverIds={leverIds} showRecos={filters.showRecos} window={window} onSelectChange={setSelected} />
          ) : (
            <LeverHeatmap derived={derived} leverIds={leverIds} window={window} onZoom={(leverId) => update({ view: 'timeline', levers: [leverId] })} />
          )}
        </Card>

        <Card className="min-h-0 overflow-hidden rounded-2xl">
          {isLoading || !derived ? <Skeleton className="h-full w-full" /> : <ChangeJournal derived={derived} onSelect={setSelected} />}
        </Card>
      </div>

      {derived && <ChangeDetailSheet derived={derived} changeId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
