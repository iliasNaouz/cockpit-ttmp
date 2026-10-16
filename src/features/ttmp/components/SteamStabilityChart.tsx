import { useMemo } from 'react'
import { SteamChart } from '@/components/shared/SteamChart'
import { Skeleton } from '@/components/ui/skeleton'
import { range, selectTicks } from '@/lib/chart-ticks'
import { useStability } from '../hooks/useTtmpData'

const Y_TICKS = range(35.5, 37.5, 0.5)

/** Courbe de stabilité vapeur sur 1 h : remplit toute la hauteur disponible. */
export function SteamStabilityChart() {
  const { data } = useStability()

  const series = useMemo(() => (data ?? []).map((point) => ({ time: point.time, actual: point.value })), [data])
  const xTicks = useMemo(() => selectTicks(series.map((point) => point.time), 10), [series])

  if (!data) return <Skeleton className="h-full min-h-[260px] w-full" />

  return (
    <div className="h-full min-h-[260px]">
      <SteamChart
        data={series}
        yDomain={[35.5, 37.5]}
        yTicks={Y_TICKS}
        xTicks={xTicks}
        setpoint={data[0]?.setpoint ?? 36}
        setpointLabel="Consigne 36.00 t/h"
        height="100%"
        showDots={false}
        actualLabel="Débit vapeur"
      />
    </div>
  )
}
