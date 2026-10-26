import { useMemo } from 'react'
import { changeMarkerColor } from '@/design-system/history-styles'
import { colors } from '@/design-system/tokens'
import type { ChangeOrigin, LeverChange, LeverDef, LeverReco, LeverSeries, RecoOutcome } from '@/types/lever-history'
import { sampleSteps } from '../utils/summarize'
import { makeTimeScale, makeValueScale } from '../utils/timeline-scale'
import { LaneLabel } from './LaneLabel'
import { RecoMarker } from './RecoMarker'

export const LANE_HEIGHT = 64

interface LeverLaneProps {
  def: LeverDef
  series: LeverSeries
  changes: LeverChange[]
  recos: LeverReco[]
  origins: Map<string, ChangeOrigin>
  outcomeByChange: Map<string, RecoOutcome>
  recoOutcome: (recoId: string) => RecoOutcome
  showRecos: boolean
  width: number
  labelWidth: number
  fromMs: number
  toMs: number
  onSelectChange: (changeId: string) => void
}

/** Un couloir : zones de fond, courbe réelle en escalier, points de changement et marqueurs de reco. */
export function LeverLane(props: LeverLaneProps) {
  const { def, series, changes, recos, origins, outcomeByChange, recoOutcome, showRecos, width, labelWidth, fromMs, toMs, onSelectChange } = props
  const right = width - 12
  const top = 8
  const bottom = LANE_HEIGHT - 8

  const x = useMemo(() => makeTimeScale(fromMs, toMs, labelWidth, right), [fromMs, toMs, labelWidth, right])
  const y = useMemo(() => makeValueScale(def.min, def.max, top, bottom), [def.min, def.max, top, bottom])
  const points = useMemo(() => sampleSteps(series.points), [series.points])

  const linePath = points
    .map((point, i) => (i === 0 ? `M${x(point.t).toFixed(1)},${y(point.value).toFixed(1)}` : `H${x(point.t).toFixed(1)}V${y(point.value).toFixed(1)}`))
    .join(' ')
  const currentValue = series.points[series.points.length - 1]?.value ?? def.min

  return (
    <div className="flex border-b border-line-soft" style={{ height: LANE_HEIGHT }}>
      <LaneLabel
        def={def}
        changeCount={changes.length}
        currentValue={currentValue}
        outcomes={recos.map((reco) => recoOutcome(reco.id))}
        width={labelWidth}
      />
      <svg width={Math.max(0, width - labelWidth)} height={LANE_HEIGHT} className="block" role="img" aria-label={`Historique ${def.label}`}>
        {/* Bandes de zones très pâles (bleu bas / vert nominal / orange haut). */}
        <rect x={labelWidth} y={y(def.zones.low)} width={right - labelWidth} height={bottom - y(def.zones.low)} fill="var(--color-zone-low)" opacity={0.1} />
        <rect x={labelWidth} y={y(def.zones.high)} width={right - labelWidth} height={y(def.zones.low) - y(def.zones.high)} fill="var(--color-zone-mid)" opacity={0.1} />
        <rect x={labelWidth} y={top} width={right - labelWidth} height={y(def.zones.high) - top} fill="var(--color-zone-high)" opacity={0.1} />

        <path d={linePath} fill="none" stroke={colors.brand} strokeWidth={1.75} />

        {showRecos &&
          recos.map((reco) => <RecoMarker key={reco.id} reco={reco} outcome={recoOutcome(reco.id)} x={x} y={y} baseline={bottom} top={top} rightEdge={right} />)}

        {changes.map((change) => {
          const cx = x(change.t)
          const cy = y(change.to)
          const color = changeMarkerColor(origins.get(change.id) ?? 'initiative', outcomeByChange.get(change.id))
          return (
            <g key={change.id} className="cursor-pointer" onClick={() => onSelectChange(change.id)}>
              <circle cx={cx} cy={cy} r={3.5} fill={color} stroke={colors.surface} strokeWidth={1.5} />
              <text x={cx} y={change.delta >= 0 ? cy - 6 : cy + 12} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: color }}>
                {change.delta >= 0 ? '+' : ''}
                {change.delta.toFixed(0)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
