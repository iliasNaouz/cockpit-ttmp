export type KpiTone = 'brand' | 'body' | 'success' | 'warning' | 'danger' | 'sub'

export const KPI_TONES: Record<KpiTone, { border: string; value: string }> = {
  brand: { border: 'border-l-brand', value: 'text-brand' },
  body: { border: 'border-l-ink-body', value: 'text-ink-body' },
  success: { border: 'border-l-success', value: 'text-success' },
  warning: { border: 'border-l-warning', value: 'text-warning' },
  danger: { border: 'border-l-danger', value: 'text-danger' },
  sub: { border: 'border-l-ink-sub', value: 'text-ink-sub' },
}
