import { useId } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import { formatTh } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'
import { SetpointLabel } from './SetpointLabel'

export interface SteamDatum {
  time: string
  actual: number | null
  predicted?: number | null
}

interface SteamChartProps {
  data: SteamDatum[]
  yDomain: [number, number]
  yTicks: number[]
  xTicks: string[]
  setpoint: number
  setpointLabel: string
  /** Hauteur en pixels, ou `'100%'` pour remplir le conteneur parent. */
  height?: number | '100%'
  showDots?: boolean
  actualLabel?: string
}

/** Courbe vapeur : aire indigo en dégradé, prédiction pointillée, consigne grise. */
export function SteamChart({
  data,
  yDomain,
  yTicks,
  xTicks,
  setpoint,
  setpointLabel,
  height = 320,
  showDots = true,
  actualLabel = 'Actual Steam',
}: SteamChartProps) {
  const gradientId = `steam-gradient-${useId().replace(/:/g, '')}`
  const hasPrediction = data.some((datum) => datum.predicted != null)

  return (
    <div className="w-full min-w-0" style={height === '100%' ? { height: '100%' } : undefined} role="img" aria-label={`Courbe ${actualLabel} (t/h)`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.brand} stopOpacity={0.18} />
              <stop offset="100%" stopColor={colors.brand} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis
            dataKey="time"
            ticks={xTicks}
            interval="preserveStartEnd"
            padding={{ left: 8, right: 8 }}
            tickMargin={8}
            tick={chartTheme.axisTick}
            axisLine={{ stroke: colors.line }}
            tickLine={{ stroke: colors.line }}
            tickSize={4}
          />
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tick={chartTheme.axisTick}
            tickFormatter={(value: number) => value.toFixed(1)}
            axisLine={false}
            tickLine={false}
            tickMargin={6}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: colors.line }}
            content={({ active, payload }) => {
              const datum = payload?.[0]?.payload as SteamDatum | undefined
              if (!active || !datum) return null
              return (
                <ChartTooltip
                  title={datum.time}
                  rows={[
                    { label: actualLabel, value: `${formatTh(datum.actual)} t/h`, color: colors.brand },
                    ...(hasPrediction
                      ? [{ label: 'Predicted +15m', value: `${formatTh(datum.predicted ?? null)} t/h`, color: colors.predicted }]
                      : []),
                    { label: 'Consigne', value: `${setpoint.toFixed(1)} t/h`, color: colors.setpoint },
                  ]}
                />
              )
            }}
          />
          <ReferenceLine
            y={setpoint}
            stroke={chartTheme.series.setpoint}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            label={{ content: (props) => <SetpointLabel viewBox={props.viewBox} text={setpointLabel} /> }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke={chartTheme.series.actual}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            connectNulls
            dot={showDots ? { r: 3.5, fill: colors.surface, stroke: colors.brand, strokeWidth: 2 } : false}
            activeDot={{ r: 5, fill: colors.surface, stroke: colors.brand, strokeWidth: 2 }}
            isAnimationActive={false}
          />
          {hasPrediction && (
            <Line
              type="monotone"
              dataKey="predicted"
              stroke={chartTheme.series.predicted}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
