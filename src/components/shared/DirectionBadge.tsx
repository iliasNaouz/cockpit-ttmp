import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { DIRECTION_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { Direction } from '@/types/domain'

export function DirectionBadge({ direction }: { direction: Direction }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-xs font-semibold',
        DIRECTION_STYLES[direction],
      )}
    >
      {direction === 'Up' && <ArrowUpRight className="size-3" aria-hidden />}
      {direction === 'Down' && <ArrowDownRight className="size-3" aria-hidden />}
      {direction}
    </span>
  )
}
