import { useCallback, useRef, useState } from 'react'
import * as api from '@/data/services/api'
import type { Message } from '@/types/chat'

export interface PendingExchange {
  conversationId: string
  user: Message
  /** Texte de l'assistant reçu jusqu'ici (vide = « en train de réfléchir »). */
  assistantText: string
}

const newId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`

/**
 * Envoie un message et affiche la réponse en streaming simulé (mot par mot).
 * `stop()` interrompt le flux : le texte déjà reçu est conservé.
 */
export function useChatStream(onSaved: () => Promise<unknown>) {
  const [pending, setPending] = useState<PendingExchange | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (conversationId: string, text: string) => {
      const controller = new AbortController()
      abortRef.current = controller
      const user: Message = { id: newId('m'), role: 'user', content: text, createdAt: new Date().toISOString() }
      setPending({ conversationId, user, assistantText: '' })

      const meta = await api.resolveChatAnswer(text)
      let received = ''
      if (!controller.signal.aborted) {
        for await (const chunk of api.streamChatAnswer(conversationId, text)) {
          if (controller.signal.aborted) break
          received += chunk
          setPending({ conversationId, user, assistantText: received })
        }
      }

      const messages: Message[] = [user]
      if (received.trim() !== '') {
        const complete = !controller.signal.aborted
        messages.push({
          id: newId('m'),
          role: 'assistant',
          content: received,
          createdAt: new Date().toISOString(),
          sources: complete ? meta.sources : undefined,
          chart: complete ? meta.chart : undefined,
        })
      }
      await api.saveMessages(conversationId, messages)
      await onSaved()
      setPending(null)
      abortRef.current = null
    },
    [onSaved],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  return { pending, isStreaming: pending !== null, send, stop }
}
