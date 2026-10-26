import { useMemo } from 'react'
import { colors } from '@/design-system/tokens'
import type { LeverPoint } from '@/types/lever-history'
import { sampleSteps } from '../utils/summarize'
import { makeTimeScale, makeValueScale, type TimeScale } from '../utils/timeline-scale'

const HEIGHT = 80
const O2_ALERT = 5

interface ContextLaneProps {
  steam: LeverPoint[]
  o2: LeverPoint[]
  setpoint: number
  width: number
  fromMs: number
  toMs: number
  labelWidth: number
}

function path(points: LeverPoint[], x: TimeScale, y: (v: number) => number): string {
  return points.map((point, i) => `${i === 0 ? 'M' : 'L'}${x(point.t).toFixed(1)},${y(point.value).toFixed(1)}`).join(' ')
}

/** Ligne de contexte : vapeur vs consigne et O₂, pour expliquer les mouvements des leviers. */
export function ContextLane({ steam, o2, setpoint, width, fromMs, toMs, labelWidth }: ContextLaneProps) {
  const right = width - 12
  const x = useMemo(() => makeTimeScale(fromMs, toMs, labelWidth, right), [fromMs, toMs, labelWidth, right])

  const steamPts = useMemo(() => sampleSteps(steam), [steam])
  const o2Pts = useMemo(() => sampleSteps(o2), [o2])

  const steamValues = steamPts.map((p) => p.value)
  const steamY = makeValueScale(Math.min(setpoint, ...steamValues) - 0.5, Math.max(setpoint, ...steamValues) + 0.5, 10, HEIGHT - 10)
  const o2Values = o2Pts.map((p) => p.value)
  const o2Y = makeValueScale(Math.min(O2_ALERT, ...o2Values) - 0.3, Math.max(O2_ALERT, ...o2Values) + 0.3, 10, HEIGHT - 10)

  return (
    <div className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="flex">
        <div className="flex shrink-0 flex-col justify-center px-3 text-[11px]" style={{ width: labelWidth }}>
          <span className="font-semibold text-ink">Contexte procédé</span>
          <span className="text-ink-sub">Vapeur · O₂</span>
        </div>
        <svg width={Math.max(0, width - labelWidth)} height={HEIGHT} className="block" role="img" aria-label="Vapeur et O₂">
          {/* Bande rouge pâle : O₂ sous le seuil. */}
          <rect x={labelWidth} y={o2Y(O2_ALERT)} width={right - labelWidth} height={HEIGHT - 10 - o2Y(O2_ALERT)} fill={colors.danger} opacity={0.06} />
          <line x1={labelWidth} x2={right} y1={steamY(setpoint)} y2={steamY(setpoint)} stroke={colors.setpoint} strokeWidth={1} strokeDasharray="5 4" />
          <path d={path(o2Pts, x, o2Y)} fill="none" stroke={colors.predicted} strokeWidth={1} opacity={0.8} />
          <path d={path(steamPts, x, steamY)} fill="none" stroke={colors.brand} strokeWidth={1.75} />
        </svg>
      </div>
    </div>
  )
}

export const CONTEXT_LANE_HEIGHT = HEIGHT
