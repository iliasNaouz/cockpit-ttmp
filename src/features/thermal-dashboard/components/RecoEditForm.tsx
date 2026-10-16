import { FilterSelect } from '@/components/shared/FilterSelect'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LEVER_ORDER } from '@/design-system/lever-styles'
import type { Direction, RecommendedLever } from '@/types/domain'

export interface RecoDraft {
  lever: RecommendedLever
  direction: Direction
  description: string
  diagnostic: string
}

const LEVER_OPTIONS = [...LEVER_ORDER, 'Timeout Error' as const].map((lever) => ({ value: lever, label: lever }))
const DIRECTION_OPTIONS = (['Up', 'Down', 'Hold'] as const).map((direction) => ({ value: direction, label: direction }))

interface RecoEditFormProps {
  draft: RecoDraft
  onChange: (draft: RecoDraft) => void
}

/** Champs éditables du panneau : levier, direction, recommandation, diagnostic. */
export function RecoEditForm({ draft, onChange }: RecoEditFormProps) {
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()} aria-label="Modifier la recommandation">
      <div className="flex flex-wrap gap-2">
        <FilterSelect label="Levier" value={draft.lever} options={LEVER_OPTIONS} onChange={(lever) => onChange({ ...draft, lever })} />
        <FilterSelect label="Direction" value={draft.direction} options={DIRECTION_OPTIONS} onChange={(direction) => onChange({ ...draft, direction })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-reco">Recommandation</Label>
        <Textarea id="edit-reco" rows={3} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-diag">Diagnostic opérationnel</Label>
        <Textarea id="edit-diag" rows={5} value={draft.diagnostic} onChange={(event) => onChange({ ...draft, diagnostic: event.target.value })} />
      </div>
    </form>
  )
}
