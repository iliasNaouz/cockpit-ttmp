import { describe, expect, it } from 'vitest'
import {
  formatDateTime,
  formatIsoDate,
  formatIsoTime,
  formatPercent,
  formatRelative,
  formatSignedDelta,
  formatTh,
  getInitials,
} from './format'

describe('format', () => {
  it('formate les valeurs t/h et les absences', () => {
    expect(formatTh(40.5)).toBe('40.50')
    expect(formatTh(null)).toBe('—')
  })

  it('formate les pourcentages', () => {
    expect(formatPercent(98)).toBe('98%')
    expect(formatPercent(30, 1)).toBe('30.0%')
    expect(formatPercent(null)).toBe('—')
  })

  it('formate les deltas signés', () => {
    expect(formatSignedDelta(0.52)).toBe('+0.52')
    expect(formatSignedDelta(-0.04)).toBe('-0.04')
    expect(formatSignedDelta(0)).toBe('0.00')
    expect(formatSignedDelta(-0.001)).toBe('0.00')
  })

  it('extrait date et heure d’un timestamp', () => {
    expect(formatIsoDate('2026-04-08T04:46:00')).toBe('2026-04-08')
    expect(formatIsoTime('2026-04-08T04:46:00')).toBe('04:46:00')
  })

  it('formate la date-heure en français', () => {
    expect(formatDateTime(new Date(2026, 9, 15, 9, 38))).toBe('15/10/2026 09:38')
  })

  it('formate les dates relatives', () => {
    const now = new Date('2026-10-15T12:00:00')
    expect(formatRelative('2026-10-15T10:00:00', now)).toBe('il y a 2 h')
    expect(formatRelative('2026-10-15T11:40:00', now)).toBe('il y a 20 min')
    expect(formatRelative('2026-10-12T12:00:00', now)).toBe('il y a 3 j')
    expect(formatRelative('2026-10-15T11:59:50', now)).toBe("à l'instant")
    expect(formatRelative(null, now)).toBe('Jamais')
  })

  it('calcule les initiales', () => {
    expect(getInitials('Ilias Naouz')).toBe('IN')
    expect(getInitials('claire')).toBe('C')
  })
})
