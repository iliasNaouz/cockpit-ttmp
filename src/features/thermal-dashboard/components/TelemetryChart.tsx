import { TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { ChartLegend, type LegendItem } from '@/components/shared/ChartLegend'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SegmentedTabs, type TabOption } from '@/components/shared/SegmentedTabs'
import { SteamChart } from '@/components/shared/SteamChart'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { colors } from '@/design-system/tokens'
import { range, selectTicks } from '@/lib/chart-ticks'
import { useTelemetry } from '../hooks/useThermalData'
import { TelemetryLinesChart, type LineSeries } from './TelemetryLinesChart'

type ChartTab = 'steam' | 'o2' | 'actuators'

const TABS: TabOption<ChartTab>[] = [
  { value: 'steam', label: 'Steam vs Consigne (40.0 t/h)' },
  { value: 'o2', label: 'Combustion O₂ & Safety (7.0%)' },
  { value: 'actuators', label: 'Grille & Poussoir (%)' },
]

const O2_SERIES: LineSeries[] = [{ key: 'o2', label: 'O₂ fumées', color: colors.successDot }]
const ACTUATOR_SERIES: LineSeries[] = [
  { key: 'grille', label: 'Grille', color: 'var(--color-lever-grille)' },
  { key: 'poussoir', label: 'Poussoir', color: 'var(--color-lever-poussoir)' },
]

const LEGENDS: Record<ChartTab, LegendItem[]> = {
  steam: [
    { label: 'Actual Steam (t/h)', color: colors.brand },
    { label: 'Predicted +15m', color: colors.predicted, variant: 'dashed' },
    { label: 'Setpoint Consigne 40.0', color: colors.setpoint, variant: 'dashed' },
  ],
  o2: [
    { label: 'O₂ fumées (%)', color: colors.successDot },
    { label: 'Seuil d’alerte 7.0%', color: colors.dangerDot, variant: 'dashed' },
  ],
  actuators: ACTUATOR_SERIES.map((item) => ({ label: `${item.label} (%)`, color: item.color })),
}

export function TelemetryChart() {
  const { data } = useTelemetry()
  const [tab, setTab] = useState<ChartTab>('steam')

  const xTicks = useMemo(() => selectTicks((data ?? []).map((point) => point.time), 10), [data])
  const steamData = useMemo(
    () => (data ?? []).map((point) => ({ time: point.time, actual: point.actual, predicted: point.predicted })),
    [data],
  )

  return (
    <Card className="p-5">
      <SectionHeader
        icon={TrendingUp}
        title="Process Telemetry & Predictive Trajectory"
        subtitle="Hover over the timeline to inspect steam generation, oxygen levels, and lever positions."
        actions={<SegmentedTabs options={TABS} value={tab} onChange={setTab} ariaLabel="Type de graphique" />}
      />
      <Separator className="my-4" />
      {!data ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <div role="tabpanel">
          {tab === 'steam' && (
            <SteamChart
              data={steamData}
              yDomain={[38.5, 42]}
              yTicks={range(38.5, 42, 0.5)}
              xTicks={xTicks}
              setpoint={40}
              setpointLabel="Consigne 40.0 t/h"
            />
          )}
          {tab === 'o2' && (
            <TelemetryLinesChart data={data} series={O2_SERIES} yDomain={[4, 8]} yTicks={range(4, 8, 1)} xTicks={xTicks} reference={{ value: 7, label: 'Alerte 7.0%' }} />
          )}
          {tab === 'actuators' && (
            <TelemetryLinesChart data={data} series={ACTUATOR_SERIES} yDomain={[20, 60]} yTicks={range(20, 60, 10)} xTicks={xTicks} />
          )}
        </div>
      )}
      <ChartLegend items={LEGENDS[tab]} className="mt-4" />
    </Card>
  )
}
