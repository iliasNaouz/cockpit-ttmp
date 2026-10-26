import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import { useSite } from '@/contexts/site-store'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Rating } from '@/types/domain'
import { useDiagnostic } from '../hooks/useDiagnostic'
import { useEvaluation } from '../hooks/useEvaluation'
import { useFitText } from '../hooks/useFitText'
import { isEvaluationComplete, type PartialEvaluation } from '../utils/evaluation'
import { DashCard } from './DashCard'
import { DiagnosticBlock, type BlockKind } from './DiagnosticBlock'
import { DiagnosticFooter } from './DiagnosticFooter'

type Field = 'diagnostic' | 'action' | 'rationale'

const BLOCKS: Array<{ kind: BlockKind; label: string; field: Field }> = [
  { kind: 'diagnostic', label: 'DIAGNOSTIC', field: 'diagnostic' },
  { kind: 'action', label: 'ACTION RECOMMANDÉE', field: 'action' },
  { kind: 'rationale', label: 'POURQUOI CETTE ACTION', field: 'rationale' },
]

/**
 * Carte « Diagnostic & Actions » : 3 blocs empilés qui se partagent la hauteur à parts égales.
 * La taille du texte s'adapte pour que tout tienne dans la carte, sans scroll ni coupure.
 */
export function DiagnosticPanel({ className }: { className?: string }) {
  const { site } = useSite()
  const { canWrite } = usePermission('ttmp')
  const { diagnostic, isLoading, refresh } = useDiagnostic()
  const [ratings, setRatings] = useState<PartialEvaluation>({})
  const evaluation = useEvaluation(() => setRatings({}))
  // Taille de police commune aux 3 paragraphes ; recalculée au changement de diagnostic.
  const { fontSize, register } = useFitText(BLOCKS.length, [diagnostic?.updatedAt, isLoading])

  const rate = (field: Field, rating: Rating) => setRatings((previous) => ({ ...previous, [field]: rating }))
  const refreshAndReset = () => {
    setRatings({})
    refresh()
  }

  return (
    <DashCard
      className={className}
      scroll={false}
      bodyClassName="flex flex-col gap-2.5 overflow-hidden px-4 py-3"
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
      {BLOCKS.map(({ kind, label, field }, index) => (
        <DiagnosticBlock
          key={kind}
          kind={kind}
          label={label}
          summary={diagnostic?.[field].summary}
          loading={isLoading}
          rating={ratings[field]}
          onRate={(rating) => rate(field, rating)}
          canWrite={canWrite}
          fontSize={fontSize}
          registerText={register(index)}
        />
      ))}
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
