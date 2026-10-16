import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { SetpointLabel } from '@/components/shared/SetpointLabel'
import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import type { TelemetryPoint } from '@/types/domain'

export interface LineSeries {
  key: 'o2' | 'grille' | 'poussoir'
  label: string
  /** Référence de couleur `var(--…)` */
  color: string
}

interface TelemetryLinesChartProps {
  data: TelemetryPoint[]
  series: LineSeries[]
  yDomain: [number, number]
  yTicks: number[]
  xTicks: string[]
  reference?: { value: number; label: string }
}

/** Courbes simples (O₂, positions de grille et de poussoir) partageant le thème de la courbe vapeur. */
export function TelemetryLinesChart({ data, series, yDomain, yTicks, xTicks, reference }: TelemetryLinesChartProps) {
  return (
    <div className="w-full min-w-0" role="img" aria-label={series.map((item) => item.label).join(', ')}>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis dataKey="time" ticks={xTicks} interval="preserveStartEnd" padding={{ left: 8, right: 8 }} tickMargin={8} tick={chartTheme.axisTick} axisLine={{ stroke: colors.line }} tickLine={{ stroke: colors.line }} tickSize={4} />
          <YAxis domain={yDomain} ticks={yTicks} tick={chartTheme.axisTick} tickFormatter={(value: number) => value.toFixed(1)} axisLine={false} tickLine={false} tickMargin={6} width={40} />
          <Tooltip
            cursor={{ stroke: colors.line }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as TelemetryPoint | undefined
              if (!active || !point) return null
              return (
                <ChartTooltip
                  title={point.time}
                  rows={series.map((item) => ({
                    label: item.label,
                    value: point[item.key] === null ? '—' : `${point[item.key]?.toFixed(1)}%`,
                    color: item.color,
                  }))}
                />
              )
            }}
          />
          {reference && (
            <ReferenceLine
              y={reference.value}
              stroke={chartTheme.series.threshold}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              label={{ content: (props) => <SetpointLabel viewBox={props.viewBox} text={reference.label} /> }}
            />
          )}
          {series.map((item) => (
            <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={2.5} dot={false} connectNulls isAnimationActive={false} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
