import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Teinte stable (0–359) calculée à partir du nom. */
function hueFromName(name: string): number {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return hash
}

const SIZES = { sm: 'size-6 text-[10px]', md: 'size-8 text-xs', lg: 'size-10 text-sm' } as const

interface UserAvatarProps {
  name: string
  size?: keyof typeof SIZES
  className?: string
}

/** Avatar à initiales sur fond pastel calculé à partir du nom. */
export function UserAvatar({ name, size = 'md', className }: UserAvatarProps) {
  const hue = hueFromName(name)
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: `hsl(${hue} 80% 90%)`, color: `hsl(${hue} 45% 30%)` }}
    >
      {getInitials(name)}
    </span>
  )
}
