import { Check } from 'lucide-react'
import { formatDayMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types/project'

interface PhaseStepperProps {
  phases: Phase[]
  /** `compact` : points reliés (carte de site) ; `full` : rond numéroté + titre + dates. */
  variant?: 'compact' | 'full'
}

function StepCircle({ phase, compact }: { phase: Phase; compact: boolean }) {
  const size = compact ? 'size-5' : 'size-7'
  if (phase.status === 'termine') {
    return (
      <span className={cn('flex items-center justify-center rounded-full bg-brand text-white', size)}>
        <Check className={compact ? 'size-3' : 'size-4'} aria-hidden />
      </span>
    )
  }
  if (phase.status === 'en_cours') {
    return (
      <span className={cn('flex items-center justify-center rounded-full border-2 border-brand bg-surface text-xs font-bold text-brand', size)}>
        {compact ? <span className="size-1.5 animate-pulse rounded-full bg-brand" /> : phase.id}
      </span>
    )
  }
  return (
    <span className={cn('flex items-center justify-center rounded-full bg-line text-xs font-semibold text-ink-sub', size)}>
      {compact ? null : phase.id}
    </span>
  )
}

const STATUS_TEXT = { termine: 'terminée', en_cours: 'en cours', a_venir: 'à venir' } as const

export function PhaseStepper({ phases, variant = 'full' }: PhaseStepperProps) {
  const compact = variant === 'compact'

  return (
    <ol className="flex w-full" aria-label="Phases du projet">
      {phases.map((phase, index) => (
        <li key={phase.id} className={cn('relative min-w-0', index < phases.length - 1 ? 'flex-1' : 'flex-none')} aria-current={phase.status === 'en_cours' ? 'step' : undefined}>
          <span className="sr-only">{`Phase ${phase.id} ${phase.title} ${STATUS_TEXT[phase.status]}`}</span>
          <div className="flex items-center">
            <StepCircle phase={phase} compact={compact} />
            {index < phases.length - 1 && (
              <span className={cn('mx-1 h-0.5 flex-1 rounded', phase.status === 'termine' ? 'bg-brand' : 'bg-line')} aria-hidden />
            )}
          </div>
          {!compact && (
            <div className="mt-2 pr-2" aria-hidden>
              <p className="text-[13px] font-semibold text-ink">{phase.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-mute">
                {formatDayMonth(phase.startDate)} → {formatDayMonth(phase.endDate)}
              </p>
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
