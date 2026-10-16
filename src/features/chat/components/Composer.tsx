import { ArrowUp, Paperclip, Square, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { MonoValue } from '@/components/shared/MonoValue'
import { Textarea } from '@/components/ui/textarea'
import { useSite } from '@/contexts/site-store'
import { isSiteId } from '@/lib/sites'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 2000
const MAX_HEIGHT = 160

interface ComposerProps {
  onSend: (text: string) => void
  onStop: () => void
  isStreaming: boolean
  canWrite: boolean
}

export function Composer({ onSend, onStop, isStreaming, canWrite }: ComposerProps) {
  const { siteId, allowedSites, setSiteId } = useSite()
  const [text, setText] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const canSend = canWrite && text.trim() !== '' && !isStreaming

  // Auto-redimensionnement : 1 à 8 lignes.
  useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`
  }, [text])

  const submit = () => {
    if (!canSend) return
    onSend(text.trim())
    setText('')
    setFiles([])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="bg-gradient-to-t from-page via-page to-transparent px-4 pt-6 pb-3">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="rounded-2xl border border-line bg-surface p-2 shadow-card">
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 px-2 pt-1 pb-2">
              {files.map((name) => (
                <li key={name} className="flex items-center gap-1 rounded-md border border-line bg-surface-muted px-2 py-0.5 text-xs text-ink-body">
                  {name}
                  <button type="button" aria-label={`Retirer ${name}`} onClick={() => setFiles((previous) => previous.filter((file) => file !== name))}>
                    <X className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Textarea
            ref={textareaRef}
            value={text}
            rows={1}
            maxLength={MAX_LENGTH}
            disabled={!canWrite}
            aria-label="Votre message"
            placeholder={canWrite ? 'Posez une question sur la production de vapeur…' : 'Accès en lecture seule'}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none focus-visible:ring-0"
          />
          <div className="mt-1 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1">
              <input ref={fileRef} type="file" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) setFiles((previous) => [...previous, file.name]); event.target.value = '' }} />
              <button type="button" disabled={!canWrite} aria-label="Joindre un fichier" onClick={() => fileRef.current?.click()} className="rounded-md p-1.5 text-ink-mute hover:bg-surface-muted hover:text-ink-body disabled:opacity-50">
                <Paperclip className="size-4" aria-hidden />
              </button>
              <FilterSelect
                label="Site"
                value={siteId}
                options={allowedSites.map((site) => ({ value: site.id, label: site.label }))}
                onChange={(value) => isSiteId(value) && setSiteId(value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <MonoValue className="text-[11px] text-ink-mute">{text.length}/{MAX_LENGTH}</MonoValue>
              {isStreaming ? (
                <button type="button" onClick={onStop} aria-label="Arrêter la réponse" className="flex size-8 items-center justify-center rounded-full bg-ink text-surface">
                  <Square className="size-3.5 fill-current" aria-hidden />
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={!canSend} aria-label="Envoyer" className={cn('flex size-8 items-center justify-center rounded-full', canSend ? 'bg-brand text-white hover:bg-brand-hover' : 'cursor-not-allowed bg-surface-muted text-ink-mute')}>
                  <ArrowUp className="size-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-mute">
          L'assistant peut se tromper. Vérifiez toujours les valeurs avant d'agir sur l'installation.
        </p>
      </div>
    </div>
  )
}
