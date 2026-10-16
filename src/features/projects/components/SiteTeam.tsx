import { Card } from '@/components/shared/Card'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { UserAvatar } from '@/components/shared/UserAvatar'
import type { TeamMember } from '@/types/project'

export function SiteTeam({ team }: { team: TeamMember[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {team.map((member) => (
        <li key={member.id}>
          <Card className="flex items-start gap-3 p-4">
            <UserAvatar name={member.name} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{member.name}</p>
              <p className="text-xs text-ink-sub">{member.projectRole}</p>
              <div className="mt-1.5"><RoleBadge role={member.toolRole} compact /></div>
              <p className="mt-1.5 truncate font-mono text-[11px] text-ink-mute">{member.email}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
