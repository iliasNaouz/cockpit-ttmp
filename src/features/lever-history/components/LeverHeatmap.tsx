import { useMemo } from 'react'
import { MonoValue } from '@/components/shared/MonoValue'
import { RECO_OUTCOME_STYLES } from '@/design-system/history-styles'
import { cn } from '@/lib/utils'
import type { RecoOutcome } from '@/types/lever-history'
import type { DerivedHistory } from '../hooks/useLeverHistory'
import type { TimeWindow } from '../utils/time-window'
import { formatHour } from '../utils/timeline-scale'

interface LeverHeatmapProps {
  derived: DerivedHistory
  leverIds: string[]
  window: TimeWindow
  onZoom: (leverId: string) => void
}

/** Taille d'une tranche selon la durée affichée. */
function sliceMinutes(spanMs: number): number {
  const hours = spanMs / 3_600_000
  if (hours <= 6) return 15
  if (hours <= 24) return 60
  return 360
}

/** Carte de chaleur leviers × tranches : vert = hausse nette, rouge = baisse, point = reco. */
export function LeverHeatmap({ derived, leverIds, window, onZoom }: LeverHeatmapProps) {
  const { data, matches } = derived
  const outcomeByReco = useMemo(() => {
    const map = new Map<string, RecoOutcome>()
    for (const match of matches) map.set(match.recoId, match.outcome)
    return map
  }, [matches])

  const slice = sliceMinutes(window.toMs - window.fromMs)
  const columns = useMemo(() => {
    const result: number[] = []
    for (let ms = window.fromMs; ms < window.toMs; ms += slice * 60_000) result.push(ms)
    return result
  }, [window.fromMs, window.toMs, slice])

  const defs = data.defs.filter((def) => leverIds.includes(def.id))

  const netChange = (leverId: string, startMs: number) => {
    const endMs = startMs + slice * 60_000
    const inSlice = data.changes.filter((c) => c.leverId === leverId && Date.parse(c.t) >= startMs && Date.parse(c.t) < endMs)
    const def = data.defs.find((d) => d.id === leverId)
    const span = def ? def.max - def.min : 1
    const net = inSlice.reduce((sum, c) => sum + c.delta, 0)
    return { net, intensity: Math.min(1, Math.abs(net) / (span * 0.15)), hasReco: inSlice.length }
  }

  return (
    <div className="scrollbar-thin h-full overflow-auto p-3">
      <table className="w-full border-separate border-spacing-[2px] text-[11px]">
        <thead>
          <tr>
            <th className="sticky left-0 bg-surface text-left font-semibold text-ink-sub">Levier</th>
            {columns.map((ms) => (
              <th key={ms} className="font-normal text-ink-mute">
                <MonoValue className="text-[10px]">{formatHour(ms)}</MonoValue>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defs.map((def) => (
            <tr key={def.id}>
              <td className="sticky left-0 bg-surface pr-2 font-medium text-ink">{def.label}</td>
              {columns.map((ms) => {
                const { net, intensity } = netChange(def.id, ms)
                const recos = data.recos.filter((r) => r.leverId === def.id && Date.parse(r.t) >= ms && Date.parse(r.t) < ms + slice * 60_000)
                const bg = net === 0 ? undefined : net > 0 ? 'var(--color-success)' : 'var(--color-danger)'
                return (
                  <td key={ms} className="p-0">
                    <button
                      type="button"
                      onClick={() => onZoom(def.id)}
                      title={`${def.label} · ${formatHour(ms)} · net ${net >= 0 ? '+' : ''}${net.toFixed(1)}`}
                      className="relative block h-6 w-6 rounded-sm border border-line-soft"
                      style={{ backgroundColor: bg, opacity: net === 0 ? 1 : 0.25 + intensity * 0.6 }}
                    >
                      {recos.map((reco, i) => (
                        <span
                          key={reco.id}
                          className={cn('absolute right-0.5 size-1.5 rounded-full', RECO_OUTCOME_STYLES[outcomeByReco.get(reco.id) ?? 'ignoree'].bar)}
                          style={{ top: 2 + i * 4 }}
                        />
                      ))}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
