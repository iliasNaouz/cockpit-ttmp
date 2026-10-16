import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePermission } from '@/auth/usePermission'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSite } from '@/contexts/site-store'
import { ChatEmptyState } from './components/ChatEmptyState'
import { ChatHeader, ListTriggerIcon } from './components/ChatHeader'
import { ChatMessages } from './components/ChatMessages'
import { Composer } from './components/Composer'
import { ConversationList } from './components/ConversationList'
import { useChatStream } from './hooks/useChatStream'
import { useConversations } from './hooks/useConversations'

/** Page Chat : colonne de conversations (280px) + fil de discussion. */
export function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { siteId } = useSite()
  const { canWrite } = usePermission('chat')
  const { conversations, isLoading, create, rename, togglePin, remove, invalidate } = useConversations()
  const stream = useChatStream(invalidate)
  const [sheetOpen, setSheetOpen] = useState(false)

  const active = conversations.find((conversation) => conversation.id === conversationId)
  const pending = stream.pending && stream.pending.conversationId === conversationId ? stream.pending : null
  const messages = active?.messages ?? []

  // Identifiant inconnu (conversation supprimée, lien périmé) : retour à une nouvelle conversation.
  useEffect(() => {
    if (!isLoading && conversationId && !active && !stream.isStreaming) navigate('/chat', { replace: true })
  }, [isLoading, conversationId, active, stream.isStreaming, navigate])

  const send = async (text: string) => {
    let id = conversationId
    if (!id) {
      const created = await create.mutateAsync(siteId)
      id = created.id
      navigate(`/chat/${id}`)
    }
    await stream.send(id, text)
  }

  const regenerate = (index: number) => {
    const question = messages.slice(0, index).reverse().find((message) => message.role === 'user')
    if (question) void send(question.content)
  }

  const deleteConversation = (id: string) => {
    remove.mutate(id)
    if (id === conversationId) navigate('/chat')
  }

  const list = (onNavigate?: () => void) => (
    <ConversationList
      conversations={conversations}
      loading={isLoading}
      activeId={conversationId}
      canWrite={canWrite}
      onNew={() => navigate('/chat')}
      onRename={(id, title) => rename.mutate({ id, title })}
      onTogglePin={(id) => togglePin.mutate(id)}
      onDelete={deleteConversation}
      onNavigate={onNavigate}
    />
  )

  const listTrigger = (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Afficher les conversations" />}>
        <ListTriggerIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="sr-only">Conversations</SheetTitle>
        {list(() => setSheetOpen(false))}
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-[280px] shrink-0 border-r border-line lg:block">{list()}</aside>
      <section className="flex min-w-0 flex-1 flex-col bg-page">
        <ChatHeader
          conversation={active}
          canWrite={canWrite}
          listTrigger={listTrigger}
          onRename={(title) => active && rename.mutate({ id: active.id, title })}
          onDelete={() => active && deleteConversation(active.id)}
        />
        {messages.length === 0 && !pending ? (
          <ChatEmptyState onPick={(prompt) => void send(prompt)} disabled={!canWrite || stream.isStreaming} />
        ) : (
          <ChatMessages messages={messages} pending={pending} canWrite={canWrite} onRegenerate={regenerate} />
        )}
        <Composer onSend={(text) => void send(text)} onStop={stream.stop} isStreaming={stream.isStreaming} canWrite={canWrite} />
      </section>
    </div>
  )
}
