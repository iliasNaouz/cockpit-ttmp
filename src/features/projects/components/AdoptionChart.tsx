import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/shared/Card'
import { ChartLegend } from '@/components/shared/ChartLegend'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import type { AdoptionWeek } from '@/types/project'

export function AdoptionChart({ weeks }: { weeks: AdoptionWeek[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-bold text-ink">Adoption hebdomadaire</h2>
      <p className="text-[13px] text-ink-sub">Recommandations émises, appliquées et évaluées positivement sur 12 semaines.</p>
      <div className="mt-4 h-[260px]" role="img" aria-label="Adoption hebdomadaire des recommandations">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={weeks} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis dataKey="label" tick={chartTheme.axisTick} axisLine={{ stroke: colors.line }} tickLine={false} />
            <YAxis yAxisId="left" tick={chartTheme.axisTick} axisLine={false} tickLine={false} width={32} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={chartTheme.axisTick} axisLine={false} tickLine={false} width={36} tickFormatter={(value: number) => `${value}%`} />
            <Tooltip
              content={({ active, payload }) => {
                const week = payload?.[0]?.payload as AdoptionWeek | undefined
                if (!active || !week) return null
                return (
                  <ChartTooltip
                    title={week.label}
                    rows={[
                      { label: 'Recos émises', value: String(week.issued), color: colors.brand },
                      { label: 'Recos appliquées', value: String(week.applied), color: colors.brand },
                      { label: 'Évaluations positives', value: `${week.positivePct}%`, color: colors.predicted },
                    ]}
                  />
                )
              }}
            />
            <Bar yAxisId="left" dataKey="issued" fill={colors.brand} fillOpacity={0.3} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Line yAxisId="left" type="monotone" dataKey="applied" stroke={colors.brand} strokeWidth={2.5} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="positivePct" stroke={colors.predicted} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend
        className="mt-3"
        items={[
          { label: 'Recos émises', color: colors.brand, variant: 'bar' },
          { label: 'Recos appliquées', color: colors.brand },
          { label: '% évaluations positives', color: colors.predicted, variant: 'dashed' },
        ]}
      />
    </Card>
  )
}
