import { MODULE_ORDER, MODULES } from '@/auth/modules'
import { getAccessLevel } from '@/auth/permissions'
import { MODULE_ICONS } from '@/components/shared/module-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ACCESS_LEVEL_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { User } from '@/types/auth'

/** 5 icônes de modules : vert = écriture, indigo = lecture, grisé = aucun. */
export function UserModuleIcons({ user }: { user: User }) {
  return (
    <ul className="flex items-center gap-1.5" aria-label="Accès par module">
      {MODULE_ORDER.map((module) => {
        const Icon = MODULE_ICONS[module]
        const level = getAccessLevel(user, module)
        const text = `${MODULES[module].label} : ${ACCESS_LEVEL_STYLES[level].label.toLowerCase()}`
        return (
          <li key={module}>
            <Tooltip>
              <TooltipTrigger render={<span className="inline-flex" tabIndex={0} role="img" aria-label={text} />}>
                <Icon className={cn('size-3.5', ACCESS_LEVEL_STYLES[level].icon)} aria-hidden />
              </TooltipTrigger>
              <TooltipContent>{text}</TooltipContent>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )
}
