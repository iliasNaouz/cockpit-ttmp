import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Rating } from '@/types/domain'

interface RatingButtonsProps {
  blockLabel: string
  value: Rating | undefined
  onChange: (rating: Rating) => void
  canWrite: boolean
  /** `md` : 36×36 ; `sm` : 28×28 (lignes de label compactes). */
  size?: 'md' | 'sm'
}

const OPTIONS = [
  { rating: 'up', icon: ThumbsUp, label: 'Pertinent', hover: 'hover:border-success-border', selected: 'bg-success-bg border-success text-success' },
  { rating: 'down', icon: ThumbsDown, label: 'Pas pertinent', hover: 'hover:border-danger-border', selected: 'bg-danger-bg border-danger text-danger' },
] as const

/**
 * Deux boutons 👍 / 👎 neutres au repos ; colorés uniquement quand ils sont sélectionnés.
 * L'option non choisie passe à 50 % d'opacité.
 */
export function RatingButtons({ blockLabel, value, onChange, canWrite, size = 'md' }: RatingButtonsProps) {
  return (
    <div className="flex shrink-0 gap-1.5" role="group" aria-label={`Évaluer : ${blockLabel}`}>
      {OPTIONS.map(({ rating, icon: Icon, label, hover, selected }) => {
        const isSelected = value === rating
        const dimmed = value !== undefined && !isSelected
        return (
          <ReadOnlyGuard key={rating} canWrite={canWrite}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    disabled={!canWrite}
                    aria-pressed={isSelected}
                    aria-label={`${label} — ${blockLabel}`}
                    onClick={() => onChange(rating)}
                    className={cn(
                      'flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed',
                      size === 'sm' ? 'size-[26px]' : 'size-9',
                      isSelected ? selected : cn('border-line bg-surface text-ink-mute hover:bg-surface-muted hover:text-ink-body', hover),
                      dimmed && 'opacity-50',
                    )}
                  />
                }
              >
                <Icon className={size === 'sm' ? 'size-3.5' : 'size-4'} fill={isSelected ? 'currentColor' : 'none'} aria-hidden />
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          </ReadOnlyGuard>
        )
      })}
    </div>
  )
}
