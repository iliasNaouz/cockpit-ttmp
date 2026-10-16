import { ROLE_LABELS, ROLE_STYLES } from '@/design-system/role-styles'
import { cn } from '@/lib/utils'
import type { Role } from '@/types/auth'

export function RoleBadge({ role, compact = false }: { role: Role; compact?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-semibold whitespace-nowrap',
        compact ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-xs',
        ROLE_STYLES[role],
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
