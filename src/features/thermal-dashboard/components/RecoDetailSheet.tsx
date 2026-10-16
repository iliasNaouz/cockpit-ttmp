import { Activity, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DetailSheet } from '@/components/shared/DetailSheet'
import { MonoValue } from '@/components/shared/MonoValue'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { isEditableTarget } from '@/lib/dom'
import type { Recommendation } from '@/types/domain'
import { useRecommendationMutations } from '../hooks/useThermalData'
import { getNeighbor } from '../utils/context-window'
import { RecoDetailBody } from './RecoDetailBody'
import type { RecoDraft } from './RecoEditForm'

interface RecoDetailSheetProps {
  /** Recommandation ouverte (`null` = panneau fermé). */
  reco: Recommendation | null
  /** Liste affichée dans le tableau : sert à la navigation ↑ / ↓. */
  navigable: Recommendation[]
  allRecos: Recommendation[]
  /** Ouvre directement en mode édition (icône crayon du tableau). */
  startInEdit: boolean
  onSelect: (reco: Recommendation) => void
  onClose: () => void
}

const toDraft = (reco: Recommendation): RecoDraft => ({
  lever: reco.lever,
  direction: reco.direction,
  description: reco.description,
  diagnostic: reco.diagnostic,
})

const ICON_BUTTON =
  'flex size-8 items-center justify-center rounded-lg text-ink-mute hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40'

/** Panneau latéral droit « Timestamp Diagnostic & Telemetry Snapshot ». */
export function RecoDetailSheet({ reco, navigable, allRecos, startInEdit, onSelect, onClose }: RecoDetailSheetProps) {
  const { canWrite } = usePermission('thermal')
  const { remove, update } = useRecommendationMutations()
  // La dernière reco reste affichée pendant l'animation de fermeture.
  const [shown, setShown] = useState<Recommendation | null>(reco)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<RecoDraft | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [wasOpen, setWasOpen] = useState(reco !== null)

  // Ouverture ou changement de reco : on repart hors édition (ou en édition si demandé).
  if (reco) {
    if (!wasOpen || reco.id !== shown?.id) {
      setShown(reco)
      setEditing(startInEdit && canWrite)
      setDraft(toDraft(reco))
    } else if (reco !== shown) {
      setShown(reco)
    }
    if (!wasOpen) setWasOpen(true)
  } else if (wasOpen) {
    setWasOpen(false)
  }

  const previous = reco ? getNeighbor(navigable, reco.id, -1) : null
  const next = reco ? getNeighbor(navigable, reco.id, 1) : null

  useEffect(() => {
    if (!reco || editing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      const target = event.key === 'ArrowUp' ? previous : event.key === 'ArrowDown' ? next : null
      if (target) {
        event.preventDefault()
        onSelect(target)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [reco, editing, previous, next, onSelect])

  if (!shown) return null

  const save = () => {
    if (draft) update.mutate({ id: shown.id, patch: draft }, { onSuccess: () => setEditing(false) })
  }

  return (
    <DetailSheet
      open={reco !== null}
      onOpenChange={(open) => !open && onClose()}
      icon={Activity}
      title="Timestamp Diagnostic & Telemetry Snapshot"
      subtitle={<><MonoValue className="text-[13px]">{shown.timestamp}</MonoValue> · Tag <MonoValue>{shown.tag}</MonoValue></>}
      headerActions={
        <>
          <button type="button" className={ICON_BUTTON} aria-label="Reco précédente" disabled={!previous} onClick={() => previous && onSelect(previous)}><ChevronUp className="size-4" aria-hidden /></button>
          <button type="button" className={ICON_BUTTON} aria-label="Reco suivante" disabled={!next} onClick={() => next && onSelect(next)}><ChevronDown className="size-4" aria-hidden /></button>
          <ReadOnlyGuard canWrite={canWrite}>
            <button type="button" className={ICON_BUTTON} aria-label="Modifier" aria-pressed={editing} disabled={!canWrite} onClick={() => setEditing((value) => !value)}><Pencil className="size-4" aria-hidden /></button>
          </ReadOnlyGuard>
        </>
      }
      footer={
        editing ? (
          <>
            <span />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditing(false); setDraft(toDraft(shown)) }}>Cancel</Button>
              <Button type="button" disabled={update.isPending} onClick={save} className="bg-brand text-white hover:bg-brand-hover">Save changes</Button>
            </div>
          </>
        ) : (
          <>
            <ReadOnlyGuard canWrite={canWrite}>
              <Button type="button" variant="ghost" disabled={!canWrite} onClick={() => setConfirmOpen(true)} className="text-danger hover:text-danger">
                <Trash2 aria-hidden /> Delete Log
              </Button>
            </ReadOnlyGuard>
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          </>
        )
      }
    >
      <RecoDetailBody reco={shown} allRecos={allRecos} editing={editing} draft={draft ?? toDraft(shown)} onDraftChange={setDraft} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce log ?"
        description={`Le log du ${shown.timestamp} sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => remove.mutate(shown.id, { onSuccess: onClose })}
      />
    </DetailSheet>
  )
}
