import { useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { LeverTab } from '@/types/domain'
import { LEVER_TABS, SLIDER_TO_HISTORY } from '../config/lever-tabs'
import { useSliderLevers } from '../hooks/useTtmpData'
import { DashCard } from './DashCard'
import { ZonedSlider } from './ZonedSlider'

/** Au-delà de 6 leviers dans un onglet, la liste défile en interne. */
const MAX_VISIBLE_ROWS = 6
const ROW_PX = 30
const ROW_GAP_PX = 4

/** Carte « Leviers actionnables » : onglets en icônes + nom complet de l'onglet actif, leviers compacts. */
export function LeverSliders({ className }: { className?: string }) {
  const { data, isLoading } = useSliderLevers()
  const { canWrite } = usePermission('ttmp')
  const [tab, setTab] = useState<LeverTab>('alimentateurs')
  // Valeurs modifiées localement (mock) : clé = id du levier.
  const [edited, setEdited] = useState<Record<string, number>>({})

  const levers = (data ?? []).filter((lever) => lever.tab === tab)
  const activeLabel = LEVER_TABS.find((option) => option.value === tab)?.label
  const maxHeight = MAX_VISIBLE_ROWS * ROW_PX + (MAX_VISIBLE_ROWS - 1) * ROW_GAP_PX

  return (
    <DashCard title="Leviers actionnables" className={className} scroll={false} bodyClassName="p-3">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div role="tablist" aria-label="Catégories de leviers" className="inline-flex gap-0.5 rounded-lg bg-surface-muted p-0.5">
          {LEVER_TABS.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === value}
                    aria-label={label}
                    onClick={() => setTab(value)}
                    className={cn(
                      'flex h-7 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                      tab === value ? 'bg-surface text-brand-hover shadow-tab' : 'text-ink-sub hover:text-ink-body',
                    )}
                  />
                }
              >
                {Icon && <Icon className="size-3.5" aria-hidden />}
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <span className="text-xs font-semibold whitespace-nowrap text-ink-body">{activeLabel}</span>
      </div>
      <div className="scrollbar-thin space-y-1 overflow-y-auto" style={{ maxHeight }} role="tabpanel">
        {isLoading && Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-[30px] w-full" />)}
        {levers.map((lever) => (
          <ZonedSlider
            key={lever.id}
            label={lever.label}
            value={edited[lever.id] ?? lever.value}
            canWrite={canWrite}
            historyLeverId={SLIDER_TO_HISTORY[lever.id]}
            onChange={(value) => setEdited((previous) => ({ ...previous, [lever.id]: value }))}
          />
        ))}
      </div>
    </DashCard>
  )
}
