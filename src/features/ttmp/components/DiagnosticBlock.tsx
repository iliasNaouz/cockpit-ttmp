import { RatingButtons } from '@/components/shared/RatingButtons'
import { SensorText } from '@/components/shared/SensorText'
import { Skeleton } from '@/components/ui/skeleton'
import { DIAGNOSTIC_BLOCK_STYLES } from '@/design-system/status-styles'
import { useScrollFade } from '@/lib/use-scroll-fade'
import { cn } from '@/lib/utils'
import type { Rating } from '@/types/domain'

export type BlockKind = keyof typeof DIAGNOSTIC_BLOCK_STYLES

interface DiagnosticBlockProps {
  kind: BlockKind
  label: string
  text: string | undefined
  loading: boolean
  rating: Rating | undefined
  onRate: (rating: Rating) => void
  canWrite: boolean
  className?: string
}

/**
 * Bloc coloré : label et boutons 👍 / 👎 sur la même ligne, texte qui défile en interne
 * (avec un fondu de 16px en bas tant qu'il reste du contenu).
 */
export function DiagnosticBlock({ kind, label, text, loading, rating, onRate, canWrite, className }: DiagnosticBlockProps) {
  const styles = DIAGNOSTIC_BLOCK_STYLES[kind]
  const { ref, showFade, onScroll } = useScrollFade<HTMLDivElement>()

  return (
    <div className={cn('relative flex min-h-0 flex-col rounded-xl border border-l-4 border-line px-4 py-2.5', styles.box, className)}>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className={cn('text-[10px] font-bold uppercase tracking-widest', styles.label)}>{label}</p>
        <RatingButtons blockLabel={label} value={rating} onChange={onRate} canWrite={canWrite} size="sm" />
      </div>
      <div ref={ref} onScroll={onScroll} className="scrollbar-thin mt-1.5 min-h-0 flex-1 overflow-y-auto">
        {loading || !text ? (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-ink-body">
            <SensorText text={text} />
          </p>
        )}
      </div>
      {showFade && (
        <div className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-4 rounded-b-xl bg-gradient-to-t to-transparent', styles.fade)} aria-hidden />
      )}
    </div>
  )
}
