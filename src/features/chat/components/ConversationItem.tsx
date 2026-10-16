import { MoreHorizontal, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { MonoValue } from '@/components/shared/MonoValue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { formatHourMinute } from '@/lib/format'
import { SITES } from '@/lib/sites'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/chat'

interface ConversationItemProps {
  conversation: Conversation
  active: boolean
  canWrite: boolean
  onRename: (title: string) => void
  onTogglePin: () => void
  onDelete: () => void
  onNavigate?: () => void
}

export function ConversationItem({ conversation, active, canWrite, onRename, onTogglePin, onDelete, onNavigate }: ConversationItemProps) {
  const [renaming, setRenaming] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [draft, setDraft] = useState(conversation.title)

  const commitRename = () => {
    if (draft.trim() !== '' && draft !== conversation.title) onRename(draft)
    setRenaming(false)
  }

  return (
    <div
      className={cn(
        'group relative flex items-center rounded-lg pr-1 hover:bg-surface-muted',
        active && 'bg-brand-soft hover:bg-brand-soft',
      )}
    >
      {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded bg-brand" aria-hidden />}
      {renaming ? (
        <Input
          autoFocus
          value={draft}
          aria-label="Nouveau titre"
          className="mx-2 my-1 h-8 text-[13px]"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitRename()
            if (event.key === 'Escape') setRenaming(false)
          }}
        />
      ) : (
        <Link to={`/chat/${conversation.id}`} onClick={onNavigate} aria-current={active ? 'page' : undefined} className="min-w-0 flex-1 px-3 py-2">
          <span className={cn('flex items-center gap-1.5 text-[13px] font-semibold', active ? 'text-brand' : 'text-ink')}>
            {conversation.pinned && <Pin className="size-3 shrink-0" aria-label="Épinglée" />}
            <span className="truncate">{conversation.title}</span>
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-mute">
            <span className="rounded bg-surface-muted px-1.5 text-ink-body">{SITES[conversation.siteId].label}</span>
            <MonoValue>{formatHourMinute(conversation.updatedAt)}</MonoValue>
          </span>
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={`Actions pour ${conversation.title}`} className="rounded p-1 text-ink-mute opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100">
          <MoreHorizontal className="size-4" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={!canWrite} onClick={() => { setDraft(conversation.title); setRenaming(true) }}>
            <Pencil aria-hidden /> Renommer
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canWrite} onClick={onTogglePin}>
            {conversation.pinned ? <PinOff aria-hidden /> : <Pin aria-hidden />}
            {conversation.pinned ? 'Désépingler' : 'Épingler'}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canWrite} className="text-danger" onClick={() => setConfirmOpen(true)}>
            <Trash2 aria-hidden /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer la conversation ?"
        description={`« ${conversation.title} » sera définitivement supprimée.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={onDelete}
      />
    </div>
  )
}
