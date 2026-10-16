import type { StabilityPoint, TtmpStatus } from '@/types/domain'

const pad = (n: number): string => String(n).padStart(2, '0')

export const TTMP_STATUS: TtmpStatus = {
  running: true,
  mode: 'ABB',
  modeDescription: 'Régulation historique, séquence Go / Slow',
  steamActual: 36.78,
  steamSetpoint: 36.0,
  stabilityPct: 99,
  o2: 4.23,
  o2Threshold: 5,
  wasteFlow: 9.9,
  thermalPower: 25.1,
}

/** 60 points à la minute, bornés entre 35,5 et 37,5 t/h, terminant à 36,78. */
export const STABILITY_SERIES: StabilityPoint[] = Array.from({ length: 60 }, (_, index) => {
  const minutes = 38 + index
  const raw =
    36.5 +
    0.55 * Math.sin(index * 0.21) +
    0.3 * Math.sin(index * 0.67 + 0.8) +
    0.12 * Math.cos(index * 1.9)
  const value = index === 59 ? 36.78 : Math.min(37.5, Math.max(35.5, raw))
  return {
    time: `${pad(8 + Math.floor(minutes / 60))}:${pad(minutes % 60)}`,
    value: Number(value.toFixed(2)),
    setpoint: 36.0,
  }
})
