import { useQueryClient } from '@tanstack/react-query'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth, useCurrentUser } from '@/auth/auth-store'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { UserAvatar } from '@/components/shared/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const user = useCurrentUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fullName = `${user.firstName} ${user.lastName}`

  const handleLogout = async () => {
    await logout()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center rounded-lg text-left hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand',
          collapsed ? 'justify-center p-1.5' : 'gap-2.5 p-2',
        )}
        aria-label={`Menu utilisateur : ${fullName}`}
      >
        <UserAvatar name={fullName} />
        <span className={cn('min-w-0 flex-1 transition-opacity duration-150', collapsed && 'sr-only')}>
          <span className="block truncate text-[13px] font-semibold text-ink">{fullName}</span>
          <RoleBadge role={user.role} compact />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={collapsed ? 'right' : 'top'} align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-[13px] font-semibold text-ink">{fullName}</p>
          <div className="mt-1"><RoleBadge role={user.role} compact /></div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast.info(`${fullName} · ${user.email}`)}>
          <UserIcon aria-hidden />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger" onClick={() => void handleLogout()}>
          <LogOut aria-hidden />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
