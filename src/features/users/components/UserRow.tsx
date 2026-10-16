import { KeyRound, MailPlus, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react'
import { MonoValue } from '@/components/shared/MonoValue'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { StatusDot } from '@/components/shared/StatusDot'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { USER_STATUS_STYLES } from '@/design-system/status-styles'
import { formatDateTime, formatRelative } from '@/lib/format'
import { SITES, SITE_IDS } from '@/lib/sites'
import { cn } from '@/lib/utils'
import type { User } from '@/types/auth'
import { fullName } from '../utils/user-filters'
import { UserModuleIcons } from './UserModuleIcons'

export interface UserRowActions {
  onEdit: (user: User) => void
  onResetPassword: (user: User) => void
  onToggleStatus: (user: User) => void
  onResendInvitation: (user: User) => void
  onDelete: (user: User) => void
}

interface UserRowProps extends UserRowActions {
  user: User
  isSelf: boolean
  canWrite: boolean
}

export function UserRow({ user, isSelf, canWrite, onEdit, onResetPassword, onToggleStatus, onResendInvitation, onDelete }: UserRowProps) {
  const status = USER_STATUS_STYLES[user.status]
  const sites = user.role === 'administrateur' ? SITE_IDS : user.sites
  const name = fullName(user)

  return (
    <TableRow className="h-[60px] border-line-soft hover:bg-page">
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar name={name} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">{name}{isSelf && <span className="ml-1.5 text-[11px] font-normal text-ink-mute">(vous)</span>}</p>
            <p className="truncate text-xs text-ink-sub">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell><RoleBadge role={user.role} /></TableCell>
      <TableCell>
        <div className="flex gap-1">
          {sites.map((id) => (
            <span key={id} className="rounded bg-surface-muted px-1.5 text-xs text-ink-body">{SITES[id].label}</span>
          ))}
        </div>
      </TableCell>
      <TableCell><UserModuleIcons user={user} /></TableCell>
      <TableCell>
        <span className="flex items-center gap-2 text-[13px] text-ink-body">
          <StatusDot className={cn(status.dot)} /> {status.label}
        </span>
      </TableCell>
      <TableCell>
        <p className="text-xs text-ink-body">{formatRelative(user.lastLoginAt)}</p>
        {user.lastLoginAt && <MonoValue className="text-[11px] text-ink-mute">{formatDateTime(new Date(user.lastLoginAt))}</MonoValue>}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label={`Actions pour ${name}`} className="rounded p-1 text-ink-mute hover:text-ink-label focus-visible:outline-2 focus-visible:outline-brand">
            <MoreHorizontal className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled={!canWrite} onClick={() => onEdit(user)}><Pencil aria-hidden /> Modifier les accès</DropdownMenuItem>
            {user.status === 'invite' && (
              <DropdownMenuItem disabled={!canWrite} onClick={() => onResendInvitation(user)}><MailPlus aria-hidden /> Renvoyer l'invitation</DropdownMenuItem>
            )}
            <DropdownMenuItem disabled={!canWrite} onClick={() => onResetPassword(user)}><KeyRound aria-hidden /> Réinitialiser le mot de passe</DropdownMenuItem>
            {user.status !== 'invite' && (
              <DropdownMenuItem disabled={!canWrite || isSelf} onClick={() => onToggleStatus(user)}>
                <Power aria-hidden /> {user.status === 'desactive' ? 'Réactiver' : 'Désactiver'}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!canWrite || isSelf} className="text-danger" onClick={() => onDelete(user)}><Trash2 aria-hidden /> Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
