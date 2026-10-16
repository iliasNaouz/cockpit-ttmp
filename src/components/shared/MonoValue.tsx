import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Valeur numérique ou horodatage : toujours en JetBrains Mono. */
export function MonoValue({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('font-mono', className)} {...props} />
}
