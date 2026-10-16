import { O2_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import { getO2Status } from '@/lib/o2-status'

export function O2Pill({ value }: { value: number | null }) {
  if (value === null) return <span className="font-mono text-sm text-ink-mute">—</span>
  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-0.5 font-mono text-xs font-semibold',
        O2_STYLES[getO2Status(value)],
      )}
    >
      {value.toFixed(1)}%
    </span>
  )
}
