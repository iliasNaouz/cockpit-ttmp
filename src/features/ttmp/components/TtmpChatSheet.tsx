import { ExternalLink, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePermission } from '@/auth/usePermission'
import { DetailSheet } from '@/components/shared/DetailSheet'
import { useSite } from '@/contexts/site-store'
import { ChatMessages } from '@/features/chat/components/ChatMessages'
import { Composer } from '@/features/chat/components/Composer'
import { useChatStream } from '@/features/chat/hooks/useChatStream'
import { useConversations } from '@/features/chat/hooks/useConversations'

export interface ChatRequest {
  /** Identifiant unique de la demande (une nouvelle question = une nouvelle conversation). */
  id: number
  question: string
}

interface Started {
  requestId: number
  conversationId: string
}

/** Panneau de chat latéral : crée une conversation pour le site courant et diffuse la réponse. */
export function TtmpChatSheet({ request, onClose }: { request: ChatRequest | null; onClose: () => void }) {
  const { siteId, site } = useSite()
  const { canWrite } = usePermission('chat')
  const { conversations, create, invalidate } = useConversations()
  const stream = useChatStream(invalidate)
  const [started, setStarted] = useState<Started | null>(null)
  const launched = useRef<number | null>(null)
  const { mutateAsync: createConversation } = create
  const { send } = stream

  useEffect(() => {
    if (!request || launched.current === request.id) return
    launched.current = request.id
    void (async () => {
      const conversation = await createConversation(siteId)
      setStarted({ requestId: request.id, conversationId: conversation.id })
      await send(conversation.id, request.question)
    })()
  }, [request, siteId, createConversation, send])

  const conversationId = started && request && started.requestId === request.id ? started.conversationId : undefined
  const conversation = conversations.find((candidate) => candidate.id === conversationId)
  const pending = stream.pending && stream.pending.conversationId === conversationId ? stream.pending : null

  return (
    <DetailSheet
      open={request !== null}
      onOpenChange={(open) => !open && onClose()}
      icon={Sparkles}
      title="Assistant Vapeur"
      subtitle={`Ligne ${site.lineName}`}
      size="sm"
      flush
      headerActions={
        conversationId ? (
          <Link
            to={`/chat/${conversationId}`}
            className="mr-1 flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Ouvrir dans Chat
          </Link>
        ) : null
      }
      footer={
        <Composer
          onSend={(text) => conversationId && void send(conversationId, text)}
          onStop={stream.stop}
          isStreaming={stream.isStreaming}
          canWrite={canWrite && conversationId !== undefined}
        />
      }
    >
      <ChatMessages messages={conversation?.messages ?? []} pending={pending} canWrite={canWrite} onRegenerate={() => undefined} />
    </DetailSheet>
  )
}
