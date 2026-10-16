import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UnderlineTabOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

interface UnderlineTabsProps<T extends string> {
  options: UnderlineTabOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  /** Variante d'en-tête de carte : sans bordure basse, hauteur réduite. */
  compact?: boolean
  /** Onglets serrés (gap réduit, 12px) pour les cartes étroites : le texte n'est jamais tronqué. */
  dense?: boolean
}

/** Onglets soulignés : actif en indigo avec trait de 2px. */
export function UnderlineTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  compact = false,
  dense = false,
}: UnderlineTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex overflow-x-auto', dense ? 'gap-3' : 'gap-5', compact ? 'h-full items-stretch' : 'border-b border-line')}
    >
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const active = optionValue === value
        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(optionValue)}
            className={cn(
              compact ? 'pt-0.5' : '-mb-px pb-2.5',
              'flex shrink-0 items-center gap-1.5 border-b-2 px-0.5 whitespace-nowrap transition-colors',
              dense ? 'text-xs' : 'text-[13px]',
              'focus-visible:outline-2 focus-visible:outline-brand',
              active
                ? 'border-brand font-semibold text-brand'
                : 'border-transparent font-medium text-ink-sub hover:text-ink-body',
            )}
          >
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {label}
          </button>
        )
      })}
    </div>
  )
}
