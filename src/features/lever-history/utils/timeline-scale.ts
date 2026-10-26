export type TimeScale = (iso: string) => number
export type ValueScale = (value: number) => number

/** Échelle temps → pixels sur [fromMs, toMs]. */
export function makeTimeScale(fromMs: number, toMs: number, left: number, right: number): TimeScale {
  const span = toMs - fromMs || 1
  return (iso) => left + ((Date.parse(iso) - fromMs) / span) * (right - left)
}

/** Échelle valeur → pixels (inversée : max en haut). */
export function makeValueScale(min: number, max: number, top: number, bottom: number): ValueScale {
  const span = max - min || 1
  return (value) => bottom - ((value - min) / span) * (bottom - top)
}

/** Graduations de temps régulières (en ms) pour l'axe. */
export function timeTicks(fromMs: number, toMs: number, count = 6): number[] {
  const step = (toMs - fromMs) / count
  return Array.from({ length: count + 1 }, (_, i) => fromMs + i * step)
}

export function formatHour(ms: number): string {
  const date = new Date(ms)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
