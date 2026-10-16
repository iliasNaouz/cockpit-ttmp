import { Sparkles } from 'lucide-react'
import { useCurrentUser } from '@/auth/auth-store'
import { useSite } from '@/contexts/site-store'
import { SuggestionChips } from './SuggestionChips'

export function ChatEmptyState({ onPick, disabled }: { onPick: (prompt: string) => void; disabled: boolean }) {
  const user = useCurrentUser()
  const { site } = useSite()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft">
        <Sparkles className="size-6 text-brand" aria-hidden />
      </span>
      <div>
        <h2 className="text-[22px] font-bold text-ink">Bonjour {user.firstName}, comment puis-je vous aider ?</h2>
        <p className="mt-1 text-[13px] text-ink-sub">Je connais en temps réel les données de la ligne {site.lineName}.</p>
      </div>
      <SuggestionChips onPick={onPick} disabled={disabled} />
    </div>
  )
}
