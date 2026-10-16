import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import { useSite } from '@/contexts/site-store'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Rating } from '@/types/domain'
import { useDiagnostic } from '../hooks/useDiagnostic'
import { useEvaluation } from '../hooks/useEvaluation'
import { isEvaluationComplete, type PartialEvaluation } from '../utils/evaluation'
import { DashCard } from './DashCard'
import { DiagnosticBlock, type BlockKind } from './DiagnosticBlock'
import { DiagnosticFooter } from './DiagnosticFooter'

/** Ordre d'affichage : Diagnostic, Action recommandée, Pourquoi cette action. */
const BLOCKS: Array<{ kind: BlockKind; label: string; field: 'diagnostic' | 'action' | 'why' }> = [
  { kind: 'diagnostic', label: 'DIAGNOSTIC', field: 'diagnostic' },
  { kind: 'action', label: 'ACTION RECOMMANDÉE', field: 'action' },
  { kind: 'why', label: 'POURQUOI CETTE ACTION', field: 'why' },
]

/** Carte « Diagnostic & Actions » : les 3 blocs sont toujours visibles et se partagent la hauteur. */
export function DiagnosticPanel({ className }: { className?: string }) {
  const { site } = useSite()
  const { canWrite } = usePermission('ttmp')
  const { diagnostic, isLoading, refresh } = useDiagnostic()
  const [ratings, setRatings] = useState<PartialEvaluation>({})
  const evaluation = useEvaluation(() => setRatings({}))

  const rate = (field: keyof PartialEvaluation, rating: Rating) => setRatings((previous) => ({ ...previous, [field]: rating }))
  const refreshAndReset = () => {
    setRatings({})
    refresh()
  }

  return (
    <DashCard
      className={className}
      scroll={false}
      bodyClassName="flex flex-col gap-2.5 p-3"
      title={`Diagnostic & Actions — ${site.lineName}`}
      actions={
        <>
          {diagnostic && <span className="hidden text-[11px] text-ink-mute sm:inline">Mis à jour {formatRelative(diagnostic.updatedAt)}</span>}
          <button
            type="button"
            onClick={refreshAndReset}
            disabled={isLoading}
            aria-label="Rafraîchir le diagnostic"
            className="flex size-7 items-center justify-center rounded-lg text-ink-sub hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-60"
          >
            <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} aria-hidden />
          </button>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        {BLOCKS.map(({ kind, label, field }) => (
          <DiagnosticBlock
            key={kind}
            kind={kind}
            label={label}
            text={diagnostic?.[field]}
            loading={isLoading}
            rating={ratings[field]}
            onRate={(rating) => rate(field, rating)}
            canWrite={canWrite}
            className="min-h-[72px] flex-1"
          />
        ))}
      </div>
      <DiagnosticFooter
        ratings={ratings}
        canWrite={canWrite}
        saving={evaluation.isPending}
        onValidate={() => isEvaluationComplete(ratings) && evaluation.mutate(ratings)}
        onRefreshReco={refreshAndReset}
      />
    </DashCard>
  )
}
