import { Activity, FileText, SlidersHorizontal, TrendingUp, type LucideIcon } from 'lucide-react'

interface Suggestion {
  icon: LucideIcon
  title: string
  description: string
}

const SUGGESTIONS: Suggestion[] = [
  { icon: Activity, title: "Pourquoi l'O₂ est-il bas ?", description: 'Analyser la situation SIT-O2BAS actuelle' },
  { icon: TrendingUp, title: 'Prévision vapeur 15 min', description: "Expliquer l'écart avec la consigne" },
  { icon: SlidersHorizontal, title: 'Quel levier actionner ?', description: "Comparer les recommandations de l'agent" },
  { icon: FileText, title: 'Résumé de la dernière heure', description: 'Synthèse des évènements et alarmes' },
]

interface SuggestionChipsProps {
  onPick: (prompt: string) => void
  disabled: boolean
}

/** Grille 2×2 de cartes suggestions : un clic envoie la question. */
export function SuggestionChips({ onPick, disabled }: SuggestionChipsProps) {
  return (
    <ul className="grid w-full max-w-[640px] gap-3 sm:grid-cols-2">
      {SUGGESTIONS.map(({ icon: Icon, title, description }) => (
        <li key={title}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPick(title)}
            className="h-full w-full rounded-xl border border-line bg-surface p-4 text-left transition hover:border-brand hover:shadow-card focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon className="size-[18px] text-brand" aria-hidden />
            <span className="mt-2 block text-[13px] font-semibold text-ink">{title}</span>
            <span className="mt-0.5 block text-xs text-ink-sub">{description}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
