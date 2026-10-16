import { cn } from '@/lib/utils'

const TONES = {
  success: 'bg-success-dot',
  warning: 'bg-warning-dot',
  danger: 'bg-danger-dot',
  neutral: 'bg-ink-mute',
} as const

export type DotTone = keyof typeof TONES

/** Petit point de statut ; `className` permet de surcharger la couleur. */
export function StatusDot({
  tone = 'success',
  pulse = false,
  className,
}: {
  tone?: DotTone
  pulse?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-2 shrink-0 rounded-full', TONES[tone], pulse && 'animate-pulse', className)}
    />
  )
}
