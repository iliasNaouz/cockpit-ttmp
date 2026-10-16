import { ArrowUp, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { usePermission } from '@/auth/usePermission'
import { cn } from '@/lib/utils'
import { isEditableTarget } from '@/lib/dom'

const SUGGESTIONS = ["Pourquoi l'O₂ est bas ?", 'Quel levier actionner ?', 'Résumé 1 h']

/** Barre de chat (56px) en bas du tableau de bord : envoie la question dans un panneau latéral. */
export function TtmpChatBar({ onSend }: { onSend: (question: string) => void }) {
  const { level, canWrite } = usePermission('chat')
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // La touche « / » donne le focus au champ.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !isEditableTarget(event.target)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (level === 'aucun') return null

  const send = (question: string) => {
    const trimmed = question.trim()
    if (!canWrite || trimmed === '') return
    onSend(trimmed)
    setText('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(text)
  }

  const canSend = canWrite && text.trim() !== ''

  return (
    <form
      onSubmit={submit}
      aria-label="Chat avec l'assistant"
      className="flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-line bg-surface px-2 shadow-card transition-shadow focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Sparkles className="size-[18px] text-brand" aria-hidden />
      </span>
      <input
        ref={inputRef}
        value={text}
        disabled={!canWrite}
        onChange={(event) => setText(event.target.value)}
        aria-label="Message à l'assistant"
        placeholder={canWrite ? "Demandez à l'assistant… ex. Pourquoi l'O₂ est-il bas ?" : 'Accès en lecture seule'}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-mute disabled:cursor-not-allowed"
      />
      {text === '' && canWrite && (
        <kbd className="hidden rounded border border-line bg-surface-muted px-1.5 font-mono text-[11px] text-ink-mute sm:inline" aria-hidden>
          /
        </kbd>
      )}
      <ul className="hidden items-center gap-2 min-[1440px]:flex">
        {SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              disabled={!canWrite}
              onClick={() => send(suggestion)}
              className="h-7 rounded-full border border-line px-3 text-xs text-ink-sub transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Envoyer"
        className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', canSend ? 'bg-brand text-white hover:bg-brand-hover' : 'cursor-not-allowed bg-surface-muted text-ink-mute')}
      >
        <ArrowUp className="size-4" aria-hidden />
      </button>
    </form>
  )
}
