import { Copy, RotateCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MessageActionsProps {
  content: string
  canWrite: boolean
  onRegenerate: () => void
}

const BUTTON = 'rounded p-1.5 text-ink-mute transition-colors hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50'

/** Copier, évaluer, régénérer : visibles au survol (toujours sur mobile). */
export function MessageActions({ content, canWrite, onRegenerate }: MessageActionsProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Réponse copiée')
    } catch {
      toast.error('Copie impossible')
    }
  }

  return (
    <div className="flex items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
      <button type="button" className={BUTTON} aria-label="Copier la réponse" onClick={() => void copy()}>
        <Copy className="size-[15px]" aria-hidden />
      </button>
      <button type="button" className={cn(BUTTON, feedback === 'up' && 'text-success')} aria-pressed={feedback === 'up'} aria-label="Réponse utile" onClick={() => setFeedback(feedback === 'up' ? null : 'up')}>
        <ThumbsUp className="size-[15px]" aria-hidden />
      </button>
      <button type="button" className={cn(BUTTON, feedback === 'down' && 'text-danger')} aria-pressed={feedback === 'down'} aria-label="Réponse peu utile" onClick={() => setFeedback(feedback === 'down' ? null : 'down')}>
        <ThumbsDown className="size-[15px]" aria-hidden />
      </button>
      <button type="button" className={BUTTON} aria-label="Régénérer la réponse" disabled={!canWrite} onClick={onRegenerate}>
        <RotateCw className="size-[15px]" aria-hidden />
      </button>
    </div>
  )
}
