import { RotateCw } from 'lucide-react'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  countEvaluated,
  EVALUATION_FIELDS,
  EVALUATION_LABELS,
  isEvaluationComplete,
  type PartialEvaluation,
} from '../utils/evaluation'

interface DiagnosticFooterProps {
  ratings: PartialEvaluation
  canWrite: boolean
  saving: boolean
  onValidate: () => void
  onRefreshReco: () => void
}

const DOT_STYLES = { up: 'bg-success-dot', down: 'bg-danger-dot' } as const

/** Pied de carte : compteur « x/3 évalués » et pastilles de couleur, puis les deux actions. */
export function DiagnosticFooter({ ratings, canWrite, saving, onValidate, onRefreshReco }: DiagnosticFooterProps) {
  const complete = isEvaluationComplete(ratings)
  const canValidate = complete && canWrite && !saving

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-2.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-ink-sub">{countEvaluated(ratings)}/3 évalués</span>
        <span className="flex items-center gap-1">
          {EVALUATION_FIELDS.map((field) => {
            const rating = ratings[field]
            const state = rating ? (rating === 'up' ? 'pertinent' : 'pas pertinent') : 'non évalué'
            return (
              <Tooltip key={field}>
                <TooltipTrigger render={<span tabIndex={0} className={cn('size-2 rounded-full', rating ? DOT_STYLES[rating] : 'bg-line')} />} />
                <TooltipContent>{`${EVALUATION_LABELS[field]} : ${state}`}</TooltipContent>
              </Tooltip>
            )
          })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="h-9 rounded-lg px-3 text-xs font-semibold" onClick={onRefreshReco}>
          <RotateCw aria-hidden />
          Actualiser la recommandation
        </Button>
        <ReadOnlyGuard canWrite={canWrite}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canValidate}
                  onClick={onValidate}
                  className={cn(
                    'h-9 rounded-lg px-3 text-xs font-semibold',
                    canValidate ? 'border-brand bg-brand text-white hover:bg-brand-hover hover:text-white' : 'cursor-not-allowed border-line text-ink-mute',
                  )}
                />
              }
            >
              Valider l'évaluation
            </TooltipTrigger>
            {!complete && <TooltipContent>Évaluez les 3 blocs pour valider</TooltipContent>}
          </Tooltip>
        </ReadOnlyGuard>
      </div>
    </div>
  )
}
