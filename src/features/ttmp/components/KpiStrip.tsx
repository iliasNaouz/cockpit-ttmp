import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Line, LineChart, YAxis } from 'recharts'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { chartTheme } from '@/design-system/chart-theme'
import { KPI_STATUS_STYLES, getKpiStatus } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import { isO2Low } from '../utils/kpi'
import { useStability, useTtmpStatus } from '../hooks/useTtmpData'
import { StripTile } from './StripTile'

const STABILITY_TARGET = 95

function Sparkline({ values }: { values: number[] }) {
  return (
    <LineChart width={80} height={28} data={values.map((value) => ({ value }))} aria-hidden>
      <YAxis hide domain={['dataMin', 'dataMax']} />
      <Line type="monotone" dataKey="value" stroke={chartTheme.series.actual} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  )
}

/** Bande KPI : 5 tuiles de 68px. Les barres restent neutres, sauf les indicateurs hors cible. */
export function KpiStrip() {
  const { data: status } = useTtmpStatus()
  const { data: series } = useStability()
  const delta = status ? status.steamActual - status.steamSetpoint : undefined
  const ecartStatus = delta === undefined ? 'normal' : getKpiStatus('ecart', delta)
  const o2Status = status ? getKpiStatus('o2', status.o2) : 'normal'
  const lowO2 = status ? isO2Low(status.o2, status.o2Threshold) : false
  const DeltaArrow = delta !== undefined && delta < 0 ? ArrowDownRight : ArrowUpRight

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 md:grid-cols-5" aria-label="Indicateurs clés">
      <StripTile label="Débit vapeur" value={status?.steamActual} digits={2} unit="t/h" status="normal" detail={series && <div className="hidden xl:block"><Sparkline values={series.map((point) => point.value)} /></div>} />
      <StripTile label="Consigne" value={status?.steamSetpoint} digits={2} unit="t/h" status="normal" />
      <StripTile
        label="Écart"
        value={delta}
        digits={2}
        unit="t/h"
        signed
        status={ecartStatus}
        detail={delta !== undefined && <DeltaArrow className={cn('size-5', KPI_STATUS_STYLES[ecartStatus].value)} aria-label={delta < 0 ? 'Sous la consigne' : 'Au-dessus de la consigne'} />}
      />
      <StripTile
        label="O₂ fumées"
        value={status?.o2}
        digits={2}
        unit="%"
        status={o2Status}
        alert={lowO2}
        secondary={status && <>seuil {status.o2Threshold} %</>}
        detail={lowO2 && <span className="rounded-md border border-danger-border bg-danger-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-danger">SIT-O2BAS</span>}
      />
      <StripTile
        label="Stabilité (1 h)"
        value={status?.stabilityPct}
        digits={0}
        unit="%"
        status={status ? getKpiStatus('stabilite', status.stabilityPct) : 'normal'}
        secondary={<>cible ≥ {STABILITY_TARGET} %</>}
        detail={status && <div className="w-14"><ProgressBar value={status.stabilityPct} barClassName="bg-success" marker={STABILITY_TARGET} label="Stabilité sur 1 heure" /></div>}
      />
    </div>
  )
}
