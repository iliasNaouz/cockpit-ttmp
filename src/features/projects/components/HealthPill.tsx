import { HEALTH_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { Health } from '@/types/project'

export function HealthPill({ health }: { health: Health }) {
  const { label, pill } = HEALTH_STYLES[health]
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap', pill)}>
      {label}
    </span>
  )
}
