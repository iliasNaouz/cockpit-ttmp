import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** 0 à 100 */
  value: number
  /** Classe de fond du remplissage (ex. `bg-brand`). */
  barClassName?: string
  /** Hauteur : 6px par défaut, 8px pour les cartes de projet. */
  size?: 'sm' | 'md'
  label?: string
}

export function ProgressBar({ value, barClassName = 'bg-brand', size = 'sm', label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('w-full overflow-hidden rounded-full bg-surface-muted', size === 'sm' ? 'h-1.5' : 'h-2')}
    >
      <div className={cn('h-full rounded-full', barClassName)} style={{ width: `${clamped}%` }} />
    </div>
  )
}
