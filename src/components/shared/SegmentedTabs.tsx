import { cn } from '@/lib/utils'

export interface TabOption<T extends string> {
  value: T
  label: string
  /** Petit point d'attention (ex. élément pas encore traité). */
  badge?: boolean
}

interface SegmentedTabsProps<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

/** Sélecteur d'onglets en segments : fond gris clair, onglet actif blanc. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex flex-wrap gap-1 rounded-lg bg-surface-muted p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-brand',
              active
                ? 'bg-surface font-semibold text-brand-hover shadow-tab'
                : 'font-medium text-ink-sub hover:text-ink-body',
            )}
          >
            {option.label}
            {option.badge && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-warning-dot align-middle" role="img" aria-label="À traiter" />}
          </button>
        )
      })}
    </div>
  )
}
