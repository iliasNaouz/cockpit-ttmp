import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import { formatIsoTime, formatTh } from '@/lib/format'
import type { Recommendation } from '@/types/domain'

interface Datum {
  time: string
  actual: number | null
  predicted: number | null
}

/** Vapeur réelle et prédiction de −15 à +15 min autour de l'instant de la reco. */
export function ContextChart({ samples, current }: { samples: Recommendation[]; current: Recommendation }) {
  const data: Datum[] = samples.map((reco) => ({
    time: formatIsoTime(reco.timestamp),
    actual: reco.actualSteam,
    predicted: reco.predictedSteam,
  }))
  const currentTime = formatIsoTime(current.timestamp)

  return (
    <div className="h-[120px] rounded-xl border border-line bg-surface p-2" role="img" aria-label="Contexte vapeur à ± 15 minutes">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
          <XAxis
            dataKey="time"
            interval="preserveStartEnd"
            tick={{ ...chartTheme.axisTickSmall, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: colors.line }}
            padding={{ left: 4, right: 4 }}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            content={({ active, payload }) => {
              const datum = payload?.[0]?.payload as Datum | undefined
              if (!active || !datum) return null
              return (
                <ChartTooltip
                  title={datum.time}
                  rows={[
                    { label: 'Actual Steam', value: `${formatTh(datum.actual)} t/h`, color: colors.brand },
                    { label: 'Predicted +15m', value: `${formatTh(datum.predicted)} t/h`, color: colors.predicted },
                  ]}
                />
              )
            }}
          />
          <ReferenceLine x={currentTime} stroke={colors.brand} strokeWidth={1.5} />
          <Line type="monotone" dataKey="actual" stroke={chartTheme.series.actual} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
          <Line type="monotone" dataKey="predicted" stroke={chartTheme.series.predicted} strokeWidth={1.5} strokeDasharray="4 4" dot={false} connectNulls isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
