import { MODULE_ORDER, MODULES } from '@/auth/modules'
import { getRoleDefault } from '@/auth/permissions'
import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { MODULE_ICONS } from '@/components/shared/module-icons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ROLE_DESCRIPTIONS, ROLE_ORDER } from '@/design-system/role-styles'
import { ACCESS_LEVEL_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { User } from '@/types/auth'

/** Matrice rôle × module et cartes de description des rôles. */
export function RolesMatrix({ users }: { users: User[] }) {
  return (
    <div className="space-y-4">
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <TableHead className="h-12 text-[11px] font-bold uppercase tracking-wider text-ink-sub">Module</TableHead>
              {ROLE_ORDER.map((role) => (
                <TableHead key={role} className="h-12"><RoleBadge role={role} /></TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULE_ORDER.map((module) => {
              const Icon = MODULE_ICONS[module]
              return (
                <TableRow key={module} className="border-line-soft hover:bg-page">
                  <TableCell>
                    <p className="flex items-center gap-2 text-[13px] font-semibold text-ink"><Icon className="size-4 text-ink-sub" aria-hidden />{MODULES[module].label}</p>
                    <p className="ml-6 text-xs text-ink-sub">{MODULES[module].description}</p>
                  </TableCell>
                  {ROLE_ORDER.map((role) => {
                    const level = ACCESS_LEVEL_STYLES[getRoleDefault(role, module)]
                    return (
                      <TableCell key={role}>
                        <span className={cn('inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold', level.pill)}>{level.label}</span>
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ROLE_ORDER.map((role) => (
          <li key={role}>
            <Card className="h-full p-4">
              <div className="flex items-center justify-between">
                <RoleBadge role={role} />
                <MonoValue className="text-lg font-bold text-ink">{users.filter((user) => user.role === role).length}</MonoValue>
              </div>
              <p className="mt-2 text-xs text-ink-sub">{ROLE_DESCRIPTIONS[role]}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
