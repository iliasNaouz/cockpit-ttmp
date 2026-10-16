import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSite } from '@/contexts/site-store'
import { isSiteId, siteInitials } from '@/lib/sites'

function SiteRadioGroup() {
  const { siteId, allowedSites, setSiteId } = useSite()

  return (
    <RadioGroup
      value={siteId}
      aria-label="Site"
      onValueChange={(value) => {
        if (typeof value === 'string' && isSiteId(value)) setSiteId(value)
      }}
      className="gap-2"
    >
      {allowedSites.map((site) => (
        <label key={site.id} className="flex cursor-pointer items-center gap-2 text-sm text-ink-body">
          <RadioGroupItem value={site.id} className="data-checked:border-brand data-checked:bg-brand" />
          {site.label}
        </label>
      ))}
    </RadioGroup>
  )
}

/** Sélecteur de site : liste de radios (déployé) ou bouton d'initiales + popover (réduit). */
export function SiteSelector({ collapsed }: { collapsed: boolean }) {
  const { site } = useSite()

  if (collapsed) {
    return (
      <Popover>
        <PopoverTrigger
          aria-label={`Site : ${site.label}`}
          className="mx-auto flex size-10 items-center justify-center rounded-lg border border-line font-mono text-xs font-semibold text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand"
        >
          {siteInitials(site.label)}
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-44">
          <h2 className="text-sm font-semibold text-ink">Site</h2>
          <SiteRadioGroup />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <section aria-labelledby="site-selector-title">
      <h2 id="site-selector-title" className="text-sm font-semibold text-ink">
        Site
      </h2>
      <div className="mt-2">
        <SiteRadioGroup />
      </div>
    </section>
  )
}
