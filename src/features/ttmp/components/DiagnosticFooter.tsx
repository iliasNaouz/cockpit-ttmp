import { RotateCw } from 'lucide-react'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatEvaluationStatus, isEvaluationComplete, type PartialEvaluation } from '../utils/evaluation'

interface DiagnosticFooterProps {
  ratings: PartialEvaluation
  canWrite: boolean
  saving: boolean
  onValidate: () => void
  onRefreshReco: () => void
}

/** Pied de carte sur une ligne : statut des votes à gauche, deux boutons compacts à droite. */
export function DiagnosticFooter({ ratings, canWrite, saving, onValidate, onRefreshReco }: DiagnosticFooterProps) {
  const canValidate = isEvaluationComplete(ratings) && canWrite && !saving

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-2.5">
      <p className="font-mono text-[11px] text-ink-mute" aria-live="polite">
        {formatEvaluationStatus(ratings)}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="h-9 rounded-lg px-3 text-xs font-semibold" onClick={onRefreshReco}>
          <RotateCw aria-hidden />
          Actualiser la recommandation
        </Button>
        <ReadOnlyGuard canWrite={canWrite}>
          <Button
            type="button"
            variant="outline"
            disabled={!canValidate}
            onClick={onValidate}
            className={cn(
              'h-9 rounded-lg px-3 text-xs font-semibold',
              canValidate ? 'border-brand bg-brand text-white hover:bg-brand-hover hover:text-white' : 'cursor-not-allowed border-line text-ink-mute',
            )}
          >
            Valider l'évaluation
          </Button>
        </ReadOnlyGuard>
      </div>
    </div>
  )
}
