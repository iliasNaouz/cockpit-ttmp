import { Lightbulb, Stethoscope, Zap, type LucideIcon } from 'lucide-react'
import { RatingButtons } from '@/components/shared/RatingButtons'
import { SensorText } from '@/components/shared/SensorText'
import { Skeleton } from '@/components/ui/skeleton'
import { DIAGNOSTIC_BLOCK_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { Rating } from '@/types/domain'

export type BlockKind = keyof typeof DIAGNOSTIC_BLOCK_STYLES

const ICONS: Record<BlockKind, LucideIcon> = { diagnostic: Stethoscope, action: Zap, rationale: Lightbulb }

interface DiagnosticBlockProps {
  kind: BlockKind
  label: string
  summary: string | undefined
  loading: boolean
  rating: Rating | undefined
  onRate: (rating: Rating) => void
  canWrite: boolean
  /** Taille de police commune (gérée par useFitText). */
  fontSize: number
  /** Enregistre le paragraphe auprès de useFitText. */
  registerText: (element: HTMLElement | null) => void
}

/**
 * Bloc de diagnostic pleine largeur : fond doux, barre + label colorés, et uniquement le paragraphe.
 * Les 3 blocs se partagent la hauteur à parts égales ; la taille du texte s'adapte (jamais de scroll).
 */
export function DiagnosticBlock({ kind, label, summary, loading, rating, onRate, canWrite, fontSize, registerText }: DiagnosticBlockProps) {
  const styles = DIAGNOSTIC_BLOCK_STYLES[kind]
  const Icon = ICONS[kind]
  const featured = kind === 'action'

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 basis-0 flex-col rounded-xl border border-l-4 px-4 py-3',
        styles.box,
        featured && 'border-l-[5px] shadow-card',
      )}
    >
      <div className="mb-1.5 flex h-7 shrink-0 items-center justify-between gap-2">
        <p className={cn('flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest', styles.label)}>
          <Icon className="size-3.5" aria-hidden />
          {label}
        </p>
        <RatingButtons blockLabel={label} value={rating} onChange={onRate} canWrite={canWrite} size="sm" />
      </div>
      <div className="min-h-0 flex-1">
        {loading || !summary ? (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        ) : (
          <p ref={registerText} className="text-ink-body" style={{ fontSize: `${fontSize}px`, lineHeight: 1.55 }}>
            <SensorText text={summary} />
          </p>
        )}
      </div>
    </div>
  )
}
