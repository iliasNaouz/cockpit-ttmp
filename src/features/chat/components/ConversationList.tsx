import { MessageSquareOff, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Conversation } from '@/types/chat'
import { groupConversations } from '../utils/conversation-groups'
import { ConversationItem } from './ConversationItem'

interface ConversationListProps {
  conversations: Conversation[]
  loading: boolean
  activeId: string | undefined
  canWrite: boolean
  onNew: () => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onNavigate?: () => void
}

/** Colonne de gauche : nouvelle conversation, recherche, liste groupée par date. */
export function ConversationList({ conversations, loading, activeId, canWrite, onNew, onRename, onTogglePin, onDelete, onNavigate }: ConversationListProps) {
  const [search, setSearch] = useState('')
  const groups = useMemo(() => groupConversations(conversations, search), [conversations, search])

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="space-y-3 p-3">
        <Button type="button" onClick={() => { onNew(); onNavigate?.() }} className="h-10 w-full rounded-lg bg-brand text-sm font-semibold text-white hover:bg-brand-hover">
          <Plus aria-hidden /> Nouvelle conversation
        </Button>
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une conversation" className="min-w-0" />
      </div>
      <nav aria-label="Conversations" className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2 pb-3">
        {loading && Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}
        {groups.map((group) => (
          <section key={group.label}>
            <h3 className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">{group.label}</h3>
              {group.conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeId}
                  canWrite={canWrite}
                  onRename={(title) => onRename(conversation.id, title)}
                  onTogglePin={() => onTogglePin(conversation.id)}
                  onDelete={() => onDelete(conversation.id)}
                  onNavigate={onNavigate}
                />
              ))}
          </section>
        ))}
        {!loading && groups.length === 0 && (
          <EmptyState icon={MessageSquareOff} title="Aucune conversation" description="Aucun résultat pour cette recherche." className="py-8" />
        )}
      </nav>
    </div>
  )
}
