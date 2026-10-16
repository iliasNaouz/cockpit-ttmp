import type { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { READ_ONLY_TOOLTIP } from '@/auth/usePermission'

interface ReadOnlyGuardProps {
  /** Vrai si l'utilisateur peut modifier : le contenu est alors rendu tel quel. */
  canWrite: boolean
  children: ReactNode
  className?: string
}

/**
 * Enveloppe un élément d'action : en lecture seule, affiche le tooltip
 * « Accès en lecture seule ». L'élément enfant doit aussi recevoir `disabled`.
 */
export function ReadOnlyGuard({ canWrite, children, className }: ReadOnlyGuardProps) {
  if (canWrite) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger render={<span className={className ?? 'inline-flex'} />}>{children}</TooltipTrigger>
      <TooltipContent>{READ_ONLY_TOOLTIP}</TooltipContent>
    </Tooltip>
  )
}
