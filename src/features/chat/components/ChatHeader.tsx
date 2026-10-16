import { Download, PanelLeft, Share2, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { StatusDot } from '@/components/shared/StatusDot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SITES } from '@/lib/sites'
import type { Conversation } from '@/types/chat'
import { conversationToMarkdown, exportFileName } from '../utils/export-markdown'

interface ChatHeaderProps {
  conversation: Conversation | undefined
  canWrite: boolean
  onRename: (title: string) => void
  onDelete: () => void
  /** Bouton d'ouverture de la liste (< 1024px). */
  listTrigger: ReactNode
}

function downloadMarkdown(conversation: Conversation): void {
  const url = URL.createObjectURL(new Blob([conversationToMarkdown(conversation)], { type: 'text/markdown' }))
  const link = document.createElement('a')
  link.href = url
  link.download = exportFileName(conversation.title)
  link.click()
  URL.revokeObjectURL(url)
}

export function ChatHeader({ conversation, canWrite, onRename, onDelete, listTrigger }: ChatHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const commit = () => {
    if (conversation && draft.trim() !== '' && draft !== conversation.title) onRename(draft)
    setEditing(false)
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié')
    } catch {
      toast.error('Copie impossible')
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4">
      <div className="flex min-w-0 items-center gap-3">
        {listTrigger}
        {editing ? (
          <Input autoFocus value={draft} aria-label="Titre de la conversation" className="h-8 w-64 text-sm font-bold" onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === 'Enter') commit(); if (event.key === 'Escape') setEditing(false) }} />
        ) : (
          <h1
            className="truncate text-sm font-bold text-ink"
            title={canWrite && conversation ? 'Double-clic pour renommer' : undefined}
            onDoubleClick={() => { if (conversation && canWrite) { setDraft(conversation.title); setEditing(true) } }}
          >
            {conversation?.title ?? 'Nouvelle conversation'}
          </h1>
        )}
        <span className="hidden rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand sm:inline">
          {SITES[conversation?.siteId ?? 'begles'].label}
        </span>
        <span className="hidden items-center gap-1.5 text-[11px] text-ink-sub md:flex">
          <StatusDot tone="success" /> Agent en ligne
        </span>
      </div>
      {conversation && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Copier le lien" onClick={() => void share()}><Share2 aria-hidden /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Exporter en Markdown" onClick={() => downloadMarkdown(conversation)}><Download aria-hidden /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Supprimer la conversation" disabled={!canWrite} onClick={() => setConfirmOpen(true)}><Trash2 aria-hidden /></Button>
          <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Supprimer la conversation ?" description={`« ${conversation.title} » sera définitivement supprimée.`} confirmLabel="Supprimer" destructive onConfirm={onDelete} />
        </div>
      )}
    </header>
  )
}

export function ListTriggerIcon() {
  return <PanelLeft aria-hidden />
}
