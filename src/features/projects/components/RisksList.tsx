import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import { RISK_STATUS_LABELS, SEVERITY_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { Risk } from '@/types/project'

export function SeverityPill({ severity }: { severity: Risk['severity'] }) {
  const { label, pill } = SEVERITY_STYLES[severity]
  return <span className={cn('inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap', pill)}>{label}</span>
}

/** Liste détaillée des risques du site. */
export function RisksList({ risks }: { risks: Risk[] }) {
  return (
    <ul className="space-y-3">
      {risks.map((risk) => (
        <li key={risk.id}>
          <Card className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-ink">{risk.title}</h3>
              <div className="flex items-center gap-2">
                <SeverityPill severity={risk.severity} />
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-body">{RISK_STATUS_LABELS[risk.status]}</span>
              </div>
            </div>
            <p className="mt-1.5 text-[13px] text-ink-body">{risk.description}</p>
            <p className="mt-2 text-xs text-ink-sub">
              <span className="font-semibold">Mitigation :</span> {risk.mitigation}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-ink-sub">
              <span>Probabilité × impact : <MonoValue className="font-semibold text-ink">{risk.probability} × {risk.impact} = {risk.probability * risk.impact}</MonoValue></span>
              <span>Responsable : <span className="font-semibold text-ink">{risk.owner}</span></span>
            </p>
          </Card>
        </li>
      ))}
    </ul>
  )
}
