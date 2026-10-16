import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from '@/contexts/sidebar-store'

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)

/** Bouton de bascule réduit / déployé, avec tooltip et raccourci Ctrl/⌘ B. */
export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar()
  const label = collapsed ? 'Déployer le menu' : 'Réduire le menu'
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            aria-keyshortcuts="Control+B Meta+B"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-mute transition-colors hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand"
          />
        }
      >
        <Icon className="size-[18px]" aria-hidden />
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
        <kbd className="rounded bg-surface/20 px-1.5 py-0.5 font-mono text-[10px]">{IS_MAC ? '⌘ B' : 'Ctrl B'}</kbd>
      </TooltipContent>
    </Tooltip>
  )
}
