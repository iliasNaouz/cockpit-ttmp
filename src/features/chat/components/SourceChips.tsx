import { Database } from 'lucide-react'
import type { Source } from '@/types/chat'

export function SourceChips({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Sources">
      {sources.map((source) => (
        <li key={source.label} className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-body">
          <Database className="size-3 text-ink-mute" aria-hidden />
          {source.label}
        </li>
      ))}
    </ul>
  )
}
