import { useMemo, useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import type { Rating, Recommendation } from '@/types/domain'
import { getContextWindow } from '../utils/context-window'
import { ContextChart } from './ContextChart'
import { ProcessVariables } from './ProcessVariables'
import { RecoEditForm, type RecoDraft } from './RecoEditForm'
import { AgentRecommendation, SheetSection, TextCard, TimeoutCard } from './RecoSections'

interface RecoDetailBodyProps {
  reco: Recommendation
  allRecos: Recommendation[]
  editing: boolean
  draft: RecoDraft
  onDraftChange: (draft: RecoDraft) => void
}

/** Corps du panneau : variables process, contexte ±15 min, recommandation, diagnostic, raison métier. */
export function RecoDetailBody({ reco, allRecos, editing, draft, onDraftChange }: RecoDetailBodyProps) {
  const { canWrite } = usePermission('thermal')
  const [rating, setRating] = useState<Rating | undefined>(undefined)
  const samples = useMemo(() => getContextWindow(allRecos, reco.id, 15), [allRecos, reco.id])
  const isTimeout = reco.lever === 'Timeout Error'

  return (
    <div className="space-y-6">
      <SheetSection title="Process variables at interval">
        <ProcessVariables reco={reco} />
      </SheetSection>
      <SheetSection title="Context ±15 min">
        <ContextChart samples={samples} current={reco} />
      </SheetSection>
      {editing ? (
        <RecoEditForm draft={draft} onChange={onDraftChange} />
      ) : isTimeout ? (
        <TimeoutCard reco={reco} />
      ) : (
        <>
          <SheetSection title="Agent recommendation">
            <AgentRecommendation reco={reco} rating={rating} onRate={setRating} canWrite={canWrite} />
          </SheetSection>
          <SheetSection title="Operational diagnostic">
            <TextCard text={reco.diagnostic} />
          </SheetSection>
          <SheetSection title="Process engineering rationale (raison métier)">
            <TextCard text={reco.rationale} />
          </SheetSection>
        </>
      )}
    </div>
  )
}
