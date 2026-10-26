import { History } from 'lucide-react'
import { useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import { DetailSheet } from '@/components/shared/DetailSheet'
import { MonoValue } from '@/components/shared/MonoValue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CHANGE_ORIGIN_STYLES, RECO_OUTCOME_STYLES } from '@/design-system/history-styles'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { DerivedHistory } from '../hooks/useLeverHistory'

interface ChangeDetailSheetProps {
  derived: DerivedHistory
  changeId: string | null
  onClose: () => void
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'danger' }) {
  return (
    <div className="rounded-xl border border-line bg-page px-3 py-2">
      <p className="text-[11px] text-ink-sub">{label}</p>
      <MonoValue className={cn('text-base font-bold', tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : 'text-ink')}>{value}</MonoValue>
    </div>
  )
}

const signed = (value: number) => `${value >= 0 ? '+' : ''}${value}`
const tone = (value: number) => (value >= 0 ? 'success' : 'danger')

/** Panneau de détail d'un changement : avant/après, reco associée, effets et annotation. */
export function ChangeDetailSheet({ derived, changeId, onClose }: ChangeDetailSheetProps) {
  const { canWrite } = usePermission('historique')
  const [note, setNote] = useState('')
  const { data, origins, outcomeByChange, effects } = derived

  const change = data.changes.find((c) => c.id === changeId)
  const def = change ? data.defs.find((d) => d.id === change.leverId) : undefined
  const effect = change ? effects.get(change.id) : undefined
  const origin = change ? origins.get(change.id) ?? 'initiative' : 'initiative'
  const outcome = change ? outcomeByChange.get(change.id) : undefined
  const style = outcome ? RECO_OUTCOME_STYLES[outcome] : CHANGE_ORIGIN_STYLES[origin]

  return (
    <DetailSheet
      open={changeId !== null}
      onOpenChange={(open) => !open && onClose()}
      icon={History}
      title={`Changement · ${def?.label ?? ''}`}
      subtitle={change && <MonoValue className="text-[13px]">{change.t.slice(0, 16).replace('T', ' ')} · {change.leverId}</MonoValue>}
    >
      {change && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className={cn('rounded-md border px-2 py-0.5 text-xs font-semibold', style.pill)}>{style.label}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Avant" value={`${change.from} ${def?.unit ?? ''}`} />
            <Stat label="Après" value={`${change.to} ${def?.unit ?? ''}`} />
            <Stat label="Écart" value={signed(change.delta)} tone={tone(change.delta)} />
          </div>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-mute">Effet observé</h3>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Vapeur +15 min" value={signed(effect?.steamDelta15 ?? 0)} tone={tone(effect?.steamDelta15 ?? 0)} />
              <Stat label="Vapeur +30 min" value={signed(effect?.steamDelta30 ?? 0)} tone={tone(effect?.steamDelta30 ?? 0)} />
              <Stat label="O₂ +15 min" value={signed(effect?.o2Delta15 ?? 0)} tone={tone(effect?.o2Delta15 ?? 0)} />
              <Stat label="O₂ +30 min" value={signed(effect?.o2Delta30 ?? 0)} tone={tone(effect?.o2Delta30 ?? 0)} />
            </div>
          </section>

          {canWrite && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-mute">Annotation</h3>
              <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Pourquoi ce changement ?" rows={3} />
              <Button
                type="button"
                className="mt-2 bg-brand text-white hover:bg-brand-hover"
                disabled={note.trim() === ''}
                onClick={() => {
                  toast.success('Annotation enregistrée')
                  setNote('')
                }}
              >
                Enregistrer
              </Button>
            </section>
          )}
        </div>
      )}
    </DetailSheet>
  )
}
