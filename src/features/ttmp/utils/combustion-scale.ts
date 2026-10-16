import type { Point } from '../config/combustion-geometry'

export type Scale = (value: number) => number

/** Échelle linéaire domaine → intervalle de pixels. */
export function linearScale(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  return (value) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)
}

/** Chaîne `points` d'un polygone SVG. */
export function toSvgPoints(points: Point[], sx: Scale, sy: Scale): string {
  return points.map((point) => `${sx(point.x).toFixed(1)},${sy(point.y).toFixed(1)}`).join(' ')
}
