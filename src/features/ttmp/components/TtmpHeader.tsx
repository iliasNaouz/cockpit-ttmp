import { UserInfoInline } from '@/components/layout/UserInfoInline'
import { Card } from '@/components/shared/Card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSite } from '@/contexts/site-store'
import { useTtmpStatus } from '../hooks/useTtmpData'

/** En-tête compact (48px) : titre, statut de la ligne, mode de régulation, utilisateur et date. */
export function TtmpHeader() {
  const { site } = useSite()
  const { data } = useTtmpStatus()

  return (
    <Card className="flex h-11 shrink-0 items-center gap-3 rounded-2xl px-4">
      <h1 className="shrink-0 text-sm font-bold text-ink">VEOLIA TTMP — Production de vapeur</h1>
      {data && (
        <>
          <span
            role="status"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-success-dot" aria-hidden />
            {site.lineName} {data.running ? 'en marche' : "à l'arrêt"}
          </span>
          <Tooltip>
            <TooltipTrigger
              render={<span tabIndex={0} className="hidden shrink-0 cursor-default rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-ink-sub md:inline" />}
            >
              {data.mode} · Go / Slow
            </TooltipTrigger>
            <TooltipContent>
              Mode régulation : {data.mode} — {data.modeDescription}
            </TooltipContent>
          </Tooltip>
        </>
      )}
      <div className="ml-auto hidden lg:block">
        <UserInfoInline />
      </div>
    </Card>
  )
}
