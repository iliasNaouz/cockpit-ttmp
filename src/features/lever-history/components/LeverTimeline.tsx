import { useMemo } from 'react'
import { useElementSize } from '@/lib/use-element-size'
import { MonoValue } from '@/components/shared/MonoValue'
import type { LeverReco, RecoOutcome } from '@/types/lever-history'
import type { DerivedHistory } from '../hooks/useLeverHistory'
import type { TimeWindow } from '../utils/time-window'
import { formatHour, timeTicks } from '../utils/timeline-scale'
import { ContextLane } from './ContextLane'
import { LeverLane } from './LeverLane'

const LABEL_WIDTH = 200

interface LeverTimelineProps {
  derived: DerivedHistory
  leverIds: string[]
  showRecos: boolean
  window: TimeWindow
  onSelectChange: (changeId: string) => void
}

/** Vue timeline : la ligne de contexte collée en haut, un couloir par levier, l'axe du temps en bas. */
export function LeverTimeline({ derived, leverIds, showRecos, window, onSelectChange }: LeverTimelineProps) {
  const [ref, size] = useElementSize<HTMLDivElement>()
  const width = size.width > 0 ? size.width : 900
  const { data, origins, outcomeByChange, matches } = derived

  const outcomeByReco = useMemo(() => {
    const map = new Map<string, RecoOutcome>()
    for (const match of matches) map.set(match.recoId, match.outcome)
    return map
  }, [matches])

  const lanes = useMemo(
    () =>
      data.defs
        .filter((def) => leverIds.includes(def.id))
        .map((def) => ({
          def,
          series: data.series.find((serie) => serie.leverId === def.id) ?? { leverId: def.id, points: [] },
          changes: data.changes.filter((change) => change.leverId === def.id),
          recos: data.recos.filter((reco: LeverReco) => reco.leverId === def.id),
        })),
    [data, leverIds],
  )

  const ticks = timeTicks(window.fromMs, window.toMs)

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <ContextLane steam={data.steam} o2={data.o2} setpoint={36} width={width} fromMs={window.fromMs} toMs={window.toMs} labelWidth={LABEL_WIDTH} />
        {lanes.map(({ def, series, changes, recos }) => (
          <LeverLane
            key={def.id}
            def={def}
            series={series}
            changes={changes}
            recos={recos}
            origins={origins}
            outcomeByChange={outcomeByChange}
            recoOutcome={(recoId) => outcomeByReco.get(recoId) ?? 'ignoree'}
            showRecos={showRecos}
            width={width}
            labelWidth={LABEL_WIDTH}
            fromMs={window.fromMs}
            toMs={window.toMs}
            onSelectChange={onSelectChange}
          />
        ))}
        {lanes.length === 0 && <p className="p-6 text-sm text-ink-sub">Aucun levier à afficher pour ce filtre.</p>}
      </div>
      {/* Axe du temps commun, collé en bas. */}
      <div className="flex shrink-0 border-t border-line" style={{ paddingLeft: LABEL_WIDTH }}>
        <div className="flex w-full justify-between px-2 py-1">
          {ticks.map((ms) => (
            <MonoValue key={ms} className="text-[10px] text-ink-mute">
              {formatHour(ms)}
            </MonoValue>
          ))}
        </div>
      </div>
    </div>
  )
}
