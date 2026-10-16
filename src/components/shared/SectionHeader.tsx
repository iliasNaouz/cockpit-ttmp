import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  /** Contenu aligné à droite (badge, onglets…). */
  actions?: ReactNode
}

export function SectionHeader({ icon: Icon, title, subtitle, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink">
          {Icon && <Icon className="size-4 text-brand" aria-hidden />}
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-ink-sub">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
