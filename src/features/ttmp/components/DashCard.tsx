import type { ReactNode } from 'react'
import { Card } from '@/components/shared/Card'
import { cn } from '@/lib/utils'

interface DashCardProps {
  title: ReactNode
  /** Actions alignées à droite de l'en-tête. */
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  /** Le corps défile en interne (scrollbar fine) ; désactiver pour un contenu qui remplit la hauteur. */
  scroll?: boolean
}

/** Carte du tableau de bord : coins 2xl, en-tête de 44px, un seul trait sous l'en-tête. */
export function DashCard({ title, actions, children, className, bodyClassName, scroll = true }: DashCardProps) {
  return (
    <Card className={cn('flex min-h-0 flex-col rounded-2xl', className)}>
      <header className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-line-soft px-4">
        {typeof title === 'string' ? <h2 className="min-w-0 truncate text-[13px] font-bold text-ink">{title}</h2> : title}
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      <div className={cn('min-h-0 flex-1 p-4', scroll && 'scrollbar-thin overflow-y-auto', bodyClassName)}>{children}</div>
    </Card>
  )
}
