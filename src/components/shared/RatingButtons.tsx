import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { RATING_STYLES } from '@/design-system/status-styles'
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
  { rating: 'up', icon: ThumbsUp, label: 'Utile' },
  { rating: 'down', icon: ThumbsDown, label: 'Pas utile' },
] as const

/** Deux boutons carrés : 👍 / 👎, sélection exclusive. */
export function RatingButtons({ blockLabel, value, onChange, canWrite, size = 'md' }: RatingButtonsProps) {
  return (
    <div className="flex shrink-0 gap-2" role="group" aria-label={`Évaluer : ${blockLabel}`}>
      {OPTIONS.map(({ rating, icon: Icon, label }) => (
        <ReadOnlyGuard key={rating} canWrite={canWrite}>
          <button
            type="button"
            disabled={!canWrite}
            aria-pressed={value === rating}
            aria-label={`${label} — ${blockLabel}`}
            onClick={() => onChange(rating)}
            className={cn(
              'flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60',
              size === 'sm' ? 'size-7' : 'size-9',
              value === rating ? RATING_STYLES[rating] : RATING_STYLES.idle,
            )}
          >
            <Icon className={size === 'sm' ? 'size-3.5' : 'size-4'} aria-hidden />
          </button>
        </ReadOnlyGuard>
      ))}
    </div>
  )
}
