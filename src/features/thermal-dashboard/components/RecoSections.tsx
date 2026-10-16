import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'
import { LeverPill } from '@/components/shared/LeverPill'
import { MonoValue } from '@/components/shared/MonoValue'
import { RatingButtons } from '@/components/shared/RatingButtons'
import { SensorText } from '@/components/shared/SensorText'
import { formatIsoTime } from '@/lib/format'
import type { Rating, Recommendation } from '@/types/domain'

export function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-mute">{title}</h3>
      {children}
    </section>
  )
}

interface AgentRecommendationProps {
  reco: Recommendation
  rating: Rating | undefined
  onRate: (rating: Rating) => void
  canWrite: boolean
}

export function AgentRecommendation({ reco, rating, onRate, canWrite }: AgentRecommendationProps) {
  return (
    <div className="space-y-3 rounded-xl border border-brand-border bg-brand-soft p-4">
      <div className="flex flex-wrap items-center gap-3">
        <LeverPill lever={reco.lever} direction={reco.direction} />
        <span className="text-sm font-bold text-brand-hover">Direction: {reco.direction}</span>
      </div>
      <p className="text-sm text-ink-body">
        <SensorText text={reco.description} />
      </p>
      <RatingButtons blockLabel="Recommandation de l'agent" value={rating} onChange={onRate} canWrite={canWrite} size="sm" />
    </div>
  )
}

export function TextCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink-body">
      <SensorText text={text} />
    </div>
  )
}

/** Remplace recommandation, diagnostic et raison métier pour une ligne en erreur. */
export function TimeoutCard({ reco }: { reco: Recommendation }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger-border bg-danger-bg p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
      <div>
        <p className="text-sm font-bold text-danger">API Connection timeout</p>
        <MonoValue className="text-xs text-ink-sub">{formatIsoTime(reco.timestamp)}</MonoValue>
      </div>
    </div>
  )
}
