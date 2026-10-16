import { ChevronLeft, ChevronRight, UserX } from 'lucide-react'
import { useState } from 'react'
import { useCurrentUser } from '@/auth/auth-store'
import { usePermission } from '@/auth/usePermission'
import { Card } from '@/components/shared/Card'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { MonoValue } from '@/components/shared/MonoValue'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { User } from '@/types/auth'
import { useUserMutations } from '../hooks/useUsers'
import { fullName, paginate } from '../utils/user-filters'
import { EditAccessSheet } from './EditAccessSheet'
import { UserRow } from './UserRow'

const COLUMNS = ['Utilisateur', 'Rôle', 'Sites', 'Modules', 'Statut', 'Dernière connexion', 'Actions']

export function UsersTable({ users }: { users: User[] }) {
  const self = useCurrentUser()
  const { canWrite } = usePermission('utilisateurs')
  const { setStatus, remove, resendInvitation, resetPassword } = useUserMutations()
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)
  const current = paginate(users, page)

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-line hover:bg-transparent">
            {COLUMNS.map((column) => (
              <TableHead key={column} className="h-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-ink-sub">{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {current.items.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === self.id}
              canWrite={canWrite}
              onEdit={setEditing}
              onResetPassword={(target) => resetPassword.mutate(target.id)}
              onToggleStatus={(target) => setStatus.mutate({ userId: target.id, status: target.status === 'desactive' ? 'actif' : 'desactive' })}
              onResendInvitation={(target) => resendInvitation.mutate(target.id)}
              onDelete={setDeleting}
            />
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && <EmptyState icon={UserX} title="Aucun utilisateur" description="Aucun compte ne correspond aux filtres sélectionnés." />}

      <div className="flex items-center justify-between border-t border-line-soft px-4 py-3 text-xs text-ink-sub">
        <MonoValue>{current.from}–{current.to} sur {users.length}</MonoValue>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Page précédente" disabled={current.page <= 1} onClick={() => setPage(current.page - 1)}><ChevronLeft aria-hidden /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Page suivante" disabled={current.page >= current.pageCount} onClick={() => setPage(current.page + 1)}><ChevronRight aria-hidden /></Button>
        </div>
      </div>

      <EditAccessSheet user={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Supprimer ce compte ?"
        description={deleting ? `Le compte de ${fullName(deleting)} (${deleting.email}) sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />
    </Card>
  )
}
