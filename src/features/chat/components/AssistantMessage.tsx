import { Sparkles } from 'lucide-react'
import type { Message } from '@/types/chat'
import { MarkdownContent } from './MarkdownContent'
import { MessageActions } from './MessageActions'
import { MessageChart } from './MessageChart'
import { SourceChips } from './SourceChips'
import { TypingIndicator } from './TypingIndicator'

interface AssistantMessageProps {
  message: Pick<Message, 'content' | 'sources' | 'chart'>
  /** Réponse en cours d'écriture : curseur clignotant, pas d'actions. */
  streaming?: boolean
  canWrite?: boolean
  onRegenerate?: () => void
}

export function AssistantMessage({ message, streaming = false, canWrite = false, onRegenerate }: AssistantMessageProps) {
  return (
    <article className="group space-y-3" aria-label="Réponse de l'assistant">
      <header className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft">
          <Sparkles className="size-3.5 text-brand" aria-hidden />
        </span>
        <span className="text-xs font-semibold text-ink">Assistant Vapeur</span>
      </header>

      {message.content === '' ? (
        <TypingIndicator />
      ) : (
        <div className="pl-9">
          <MarkdownContent content={message.content} />
          {streaming && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand align-middle" aria-hidden />}
        </div>
      )}

      {!streaming && (
        <div className="space-y-3 pl-9">
          {message.sources && <SourceChips sources={message.sources} />}
          {message.chart && <MessageChart chart={message.chart} />}
          <MessageActions content={message.content} canWrite={canWrite} onRegenerate={() => onRegenerate?.()} />
        </div>
      )}
    </article>
  )
}
