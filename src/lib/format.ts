const DASH = '—'

const pad = (n: number): string => String(n).padStart(2, '0')

/** `40.52` ou `—` si la valeur est absente. */
export function formatTh(value: number | null, digits = 2): string {
  return value === null ? DASH : value.toFixed(digits)
}

/** `98%` (sans espace, comme dans les maquettes). */
export function formatPercent(value: number | null, digits = 0): string {
  return value === null ? DASH : `${value.toFixed(digits)}%`
}

/** `28.2 MW` */
export function formatMw(value: number, digits = 1): string {
  return `${value.toFixed(digits)} MW`
}

/** `+0.52` / `-0.04` / `0.00`. */
export function formatSignedDelta(value: number, digits = 2): string {
  const rounded = Number(value.toFixed(digits))
  if (rounded === 0) return (0).toFixed(digits)
  return `${rounded > 0 ? '+' : '-'}${Math.abs(rounded).toFixed(digits)}`
}

/** `2026-04-08` depuis `2026-04-08T04:46:00`. */
export function formatIsoDate(timestamp: string): string {
  return timestamp.slice(0, 10)
}

/** `04:46:00` depuis `2026-04-08T04:46:00`. */
export function formatIsoTime(timestamp: string): string {
  return timestamp.slice(11, 19)
}

/** `15/10/2026 09:38` */
export function formatDateTime(date: Date): string {
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** `15/10/2026` */
export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** `28/10` depuis une date ISO. */
export function formatDayMonth(value: string): string {
  const date = new Date(value)
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

/** `09:38` */
export function formatHourMinute(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** `il y a 2 h`, `il y a 3 j`, `à l'instant`, `Jamais`. */
export function formatRelative(value: string | null, now: Date = new Date()): string {
  if (value === null) return 'Jamais'
  const diffMs = now.getTime() - new Date(value).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `il y a ${days} j`
  const months = Math.floor(days / 30)
  return `il y a ${months} mois`
}

/** Initiales (2 lettres max) d'un nom. */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
