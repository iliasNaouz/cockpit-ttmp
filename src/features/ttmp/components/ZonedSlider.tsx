import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MonoValue } from '@/components/shared/MonoValue'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { cn } from '@/lib/utils'
import { SLIDER_ZONES } from '../config/lever-tabs'

const ZONE_TRACK = `linear-gradient(to right,
  var(--color-zone-low) 0 ${SLIDER_ZONES.lowEnd}%,
  var(--color-zone-mid) ${SLIDER_ZONES.lowEnd}% ${SLIDER_ZONES.highStart}%,
  var(--color-zone-high) ${SLIDER_ZONES.highStart}% 100%)`

/** Au-delà de ce nombre de caractères, le libellé passe en 11px pour ne pas être coupé. */
const LONG_LABEL = 30

interface ZonedSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  canWrite: boolean
  /** Si fourni, le nom devient un lien vers l'historique de ce levier. */
  historyLeverId?: string
}

/** Levier de 34px : libellé (16px) + valeur mono sur une ligne, slider à piste 3 zones (18px) dessous. */
export function ZonedSlider({ label, value, onChange, canWrite, historyLeverId }: ZonedSliderProps) {
  const labelClass = cn('min-w-0 truncate text-ink-body', label.length > LONG_LABEL ? 'text-[11px]' : 'text-xs')

  return (
    <div className="group h-[30px]">
      <div className="flex h-3.5 items-center justify-between gap-2">
        {historyLeverId ? (
          <Link
            to={`/historique-leviers?lever=${historyLeverId}&period=6h`}
            title={`Historique de ${label}`}
            className={cn(labelClass, 'inline-flex items-center gap-1 hover:text-brand')}
          >
            <span className="truncate">{label}</span>
            <History className="size-3 shrink-0 text-ink-mute opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </Link>
        ) : (
          <span className={labelClass} title={label}>
            {label}
          </span>
        )}
        <MonoValue className="shrink-0 text-xs font-semibold text-ink">{value} %</MonoValue>
      </div>
      <ReadOnlyGuard canWrite={canWrite} className="flex h-4 w-full">
        <SliderPrimitive.Root
          value={value}
          min={0}
          max={100}
          disabled={!canWrite}
          onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
          className="w-full"
          aria-label={label}
        >
          <SliderPrimitive.Control className="relative flex h-4 w-full touch-none items-center select-none data-disabled:opacity-60">
            <SliderPrimitive.Track className="h-1.5 w-full rounded-full" style={{ background: ZONE_TRACK }} />
            <SliderPrimitive.Thumb
              aria-label={label}
              className="relative block size-3.5 rounded-full border-2 border-thumb-border bg-surface shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] text-surface opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                {value}
              </span>
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>
      </ReadOnlyGuard>
    </div>
  )
}
