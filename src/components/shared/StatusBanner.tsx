interface StatusBannerProps {
  title: string
  detail?: string
}

/** Bannière de statut « en marche » : fond vert pâle et point pulsant. */
export function StatusBanner({ title, detail }: StatusBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-success-border bg-success-bg px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-success-dot" aria-hidden />
        <span className="text-xs font-bold uppercase text-success-strong">{title}</span>
      </div>
      {detail && <span className="text-[11px] font-semibold text-success">{detail}</span>}
    </div>
  )
}
