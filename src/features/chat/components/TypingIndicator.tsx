/** Trois points animés dans une capsule : l'assistant prépare sa réponse. */
export function TypingIndicator() {
  return (
    <div role="status" aria-label="L'assistant écrit" className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-2">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="size-1.5 animate-bounce rounded-full bg-ink-mute" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  )
}
