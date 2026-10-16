import { Dialog } from '@base-ui/react/dialog'
import { X, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  icon: LucideIcon
  title: string
  subtitle?: ReactNode
  /** Boutons placés avant la croix de fermeture. */
  headerActions?: ReactNode
  /** Pied collant (actions principales). */
  footer?: ReactNode
  /** Largeur du panneau à partir de 640px (plein écran en dessous). */
  size?: 'md' | 'sm' | 'xl'
  /** Corps sans marge ni défilement propre (le contenu gère sa hauteur) ; pied sans marge. */
  flush?: boolean
  children: ReactNode
}

const WIDTHS = { md: 'sm:max-w-[560px]', sm: 'sm:max-w-[480px]', xl: 'sm:max-w-[900px]' } as const

/**
 * Panneau latéral droit générique : en-tête collant, corps qui défile, pied collant.
 * Fermeture par la croix, Échap ou clic sur l'overlay ; la page reste lisible derrière.
 */
export function DetailSheet({ open, onOpenChange, icon: Icon, title, subtitle, headerActions, footer, size = 'md', flush = false, children }: DetailSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          data-slot="detail-sheet"
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line bg-surface shadow-2xl outline-none',
            'transition-transform duration-[250ms] ease-out data-ending-style:translate-x-full data-ending-style:duration-200 data-starting-style:translate-x-full',
            WIDTHS[size],
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-line px-6 py-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
              <Icon className="size-5 text-brand" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-[17px] leading-tight font-bold text-ink">{title}</Dialog.Title>
              {subtitle && <div className="mt-1 text-[13px] text-ink-sub">{subtitle}</div>}
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {headerActions}
              <Dialog.Close
                aria-label="Fermer"
                className="flex size-8 items-center justify-center rounded-lg text-ink-mute hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand"
              >
                <X className="size-4" aria-hidden />
              </Dialog.Close>
            </div>
          </header>
          <div className={cn('min-h-0 flex-1', flush ? 'flex flex-col overflow-hidden' : 'scrollbar-thin overflow-y-auto px-6 py-6')}>{children}</div>
          {footer && (
            <footer className={cn('shrink-0 border-t border-line bg-surface', flush ? 'p-0' : 'flex items-center justify-between gap-3 px-6 py-4')}>
              {footer}
            </footer>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
