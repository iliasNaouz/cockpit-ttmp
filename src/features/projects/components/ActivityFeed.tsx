import { AlertTriangle, CheckSquare, Flag, Rocket, ThumbsUp, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { SITES } from '@/lib/sites'
import { formatRelative } from '@/lib/format'
import type { ActivityEvent, ActivityType } from '@/types/project'

const ICONS: Record<ActivityType, LucideIcon> = {
  jalon: Flag,
  tache: CheckSquare,
  risque: AlertTriangle,
  deploiement: Rocket,
  evaluation: ThumbsUp,
}

interface ActivityFeedProps {
  events: ActivityEvent[]
  title?: string
  showSite?: boolean
}

/** Fil d'activité : icône, texte, site et date relative. */
export function ActivityFeed({ events, title = 'Activité récente', showSite = true }: ActivityFeedProps) {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      <ul className="mt-3 divide-y divide-line-soft">
        {events.map((event) => {
          const Icon = ICONS[event.type]
          return (
            <li key={event.id} className="flex items-start gap-3 py-2.5">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Icon className="size-3.5 text-brand" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-ink-body">{event.text}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-mute">
                  {showSite && <span className="rounded bg-surface-muted px-1.5 text-ink-body">{SITES[event.siteId].label}</span>}
                  {formatRelative(event.at)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
