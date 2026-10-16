import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/shared/Card'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import type { ChartPoint, MessageChart as MessageChartData } from '@/types/chat'

/** Mini-carte de données : courbe indigo de 120px de haut. */
export function MessageChart({ chart }: { chart: MessageChartData }) {
  const values = chart.points.map((point) => point.value)
  const domain: [number, number] = [Math.floor(Math.min(...values) * 10) / 10, Math.ceil(Math.max(...values) * 10) / 10]

  return (
    <Card className="p-3">
      <p className="mb-2 text-xs font-semibold text-ink">{chart.title}</p>
      <div className="h-[120px]" role="img" aria-label={chart.title}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart.points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" tick={chartTheme.axisTickSmall} tickLine={false} axisLine={{ stroke: colors.line }} interval="preserveStartEnd" />
            <YAxis domain={domain} tick={chartTheme.axisTickSmall} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as ChartPoint | undefined
                if (!active || !point) return null
                return <ChartTooltip title={point.label} rows={[{ label: 'Valeur', value: `${point.value.toFixed(2)} ${chart.unit}`, color: colors.brand }]} />
              }}
            />
            <Line type="monotone" dataKey="value" stroke={chartTheme.series.actual} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
