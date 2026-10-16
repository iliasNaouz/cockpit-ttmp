import { AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { LEVER_STYLES } from '@/design-system/lever-styles'
import { cn } from '@/lib/utils'
import type { Direction, RecommendedLever } from '@/types/domain'

interface LeverPillProps {
  lever: RecommendedLever
  direction?: Direction
}

/** Pill de levier avec flèche de direction (ou alerte pour un Timeout Error). */
export function LeverPill({ lever, direction }: LeverPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-semibold whitespace-nowrap',
        LEVER_STYLES[lever].pill,
      )}
    >
      {lever === 'Timeout Error' && <AlertTriangle className="size-3.5" aria-hidden />}
      {lever}
      {direction === 'Up' && <ArrowUpRight className="size-3.5" aria-label="Hausse" />}
      {direction === 'Down' && (
        <ArrowDownRight className="size-3.5 text-danger" aria-label="Baisse" />
      )}
    </span>
  )
}
