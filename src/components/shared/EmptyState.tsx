import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  /** Classes du cercle d'icône (fond) et de l'icône. */
  iconClassName?: string
  circleClassName?: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconClassName = 'text-ink-mute',
  circleClassName = 'bg-surface-muted',
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <span className={cn('flex size-16 items-center justify-center rounded-full', circleClassName)}>
        <Icon className={cn('size-10', iconClassName)} aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
      {description && <p className="mt-1.5 max-w-md text-[13px] text-ink-sub">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
