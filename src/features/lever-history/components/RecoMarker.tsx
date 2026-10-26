import { RECO_OUTCOME_STYLES } from '@/design-system/history-styles'
import type { LeverReco, RecoOutcome } from '@/types/lever-history'
import type { TimeScale, ValueScale } from '../utils/timeline-scale'

const WINDOW_MIN = 30

interface RecoMarkerProps {
  reco: LeverReco
  outcome: RecoOutcome
  x: TimeScale
  y: ValueScale
  baseline: number
  top: number
  rightEdge: number
}

/** Marqueur d'une reco : triangle (Up/Down) ou losange (Hold), bande de 30 min et cible fantôme. */
export function RecoMarker({ reco, outcome, x, y, baseline, top, rightEdge }: RecoMarkerProps) {
  const color = RECO_OUTCOME_STYLES[outcome].color
  const cx = x(reco.t)
  const windowEnd = Math.min(rightEdge, x(new Date(new Date(reco.t).getTime() + WINDOW_MIN * 60_000).toISOString()))

  const marker = () => {
    if (reco.direction === 'Up') return <polygon points={`${cx},${baseline - 10} ${cx - 5},${baseline} ${cx + 5},${baseline}`} fill={color} />
    if (reco.direction === 'Down') return <polygon points={`${cx},${baseline} ${cx - 5},${baseline - 10} ${cx + 5},${baseline - 10}`} fill={color} />
    return <rect x={cx - 4} y={baseline - 8} width={8} height={8} transform={`rotate(45 ${cx} ${baseline - 4})`} fill={color} />
  }

  return (
    <g>
      <rect x={cx} y={top} width={Math.max(0, windowEnd - cx)} height={baseline - top} fill="var(--color-brand)" opacity={0.06} />
      {reco.target !== undefined && (
        <line x1={cx} y1={y(reco.target)} x2={windowEnd} y2={y(reco.target)} stroke="var(--color-brand)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
      )}
      {marker()}
    </g>
  )
}
