import { KpiTile } from '@/components/shared/KpiTile'
import type { User } from '@/types/auth'
import { computeUserKpis } from '../utils/user-filters'

export function UsersKpis({ users }: { users: User[] }) {
  const kpis = computeUserKpis(users)
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiTile value={String(kpis.total)} label="Utilisateurs" tone="brand" />
      <KpiTile value={String(kpis.active)} label="Actifs" tone="success" />
      <KpiTile value={String(kpis.invited)} label="Invitations en attente" tone="warning" />
      <KpiTile value={String(kpis.disabled)} label="Désactivés" tone="sub" />
    </div>
  )
}
