import { Button } from '@/components/ui/button'

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 21 21" className="size-4" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="var(--color-ms-red)" />
      <rect x="11" y="1" width="9" height="9" fill="var(--color-ms-green)" />
      <rect x="1" y="11" width="9" height="9" fill="var(--color-ms-blue)" />
      <rect x="11" y="11" width="9" height="9" fill="var(--color-ms-yellow)" />
    </svg>
  )
}

interface MicrosoftButtonProps {
  onClick: () => void
  disabled?: boolean
}

/** Mock : connecte le compte administrateur de démonstration. */
export function MicrosoftButton({ onClick, disabled }: MicrosoftButtonProps) {
  return (
    <Button type="button" variant="outline" className="h-10 w-full text-sm font-semibold" onClick={onClick} disabled={disabled}>
      <MicrosoftIcon />
      Se connecter avec Microsoft
    </Button>
  )
}
