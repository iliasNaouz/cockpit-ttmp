import { cn } from '@/lib/utils'

/** Logo complet (symbole + VEOLIA), `public/logo-veolia.png`. `inverted` le rend blanc pour les fonds de marque. */
export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <img
      src="/logo-veolia.png"
      alt="Veolia"
      className={cn('h-8 w-auto shrink-0 object-contain', inverted && 'brightness-0 invert', className)}
    />
  )
}

/** Symbole seul (rond), `public/logo-mark.png` : sidebar réduite. */
export function LogoMark({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt="Veolia"
      className={cn('size-8', inverted && 'brightness-0 invert', className)}
    />
  )
}
