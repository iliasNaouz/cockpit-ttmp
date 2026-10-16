import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Message } from '@/types/chat'
import type { PendingExchange } from '../hooks/useChatStream'
import { AssistantMessage } from './AssistantMessage'
import { MessageBubble } from './MessageBubble'

interface ChatMessagesProps {
  messages: Message[]
  pending: PendingExchange | null
  canWrite: boolean
  onRegenerate: (messageIndex: number) => void
}

const NEAR_BOTTOM_PX = 80

/** Fil centré (760px) : défilement automatique, bouton flottant quand on remonte. */
export function ChatMessages({ messages, pending, canWrite, onRegenerate }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)
  const [showJump, setShowJump] = useState(false)

  const scrollToBottom = () => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })

  useEffect(() => {
    if (stickRef.current) containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight })
  }, [messages.length, pending?.assistantText])

  const onScroll = () => {
    const element = containerRef.current
    if (!element) return
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < NEAR_BOTTOM_PX
    stickRef.current = nearBottom
    setShowJump(!nearBottom)
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={containerRef} onScroll={onScroll} className="h-full overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6" aria-live="polite">
          {messages.map((message, index) =>
            message.role === 'user' ? (
              <MessageBubble key={message.id} message={message} />
            ) : (
              <AssistantMessage key={message.id} message={message} canWrite={canWrite} onRegenerate={() => onRegenerate(index)} />
            ),
          )}
          {pending && (
            <>
              <MessageBubble message={pending.user} />
              <AssistantMessage message={{ content: pending.assistantText }} streaming />
            </>
          )}
        </div>
      </div>
      {showJump && (
        <button type="button" aria-label="Aller au dernier message" onClick={scrollToBottom} className="absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-surface shadow-card hover:bg-surface-muted">
          <ArrowDown className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
}
