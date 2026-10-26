import { pciPower } from '../config/combustion-geometry'

export interface PillBox {
  /** Centre horizontal (px) */
  center: number
  width: number
}

/** Rangée (0, 1, …) de chaque pill pour qu'aucune ne chevauche sa voisine. */
export function assignRows(pills: PillBox[], gap = 4): number[] {
  const rows: Array<Array<{ left: number; right: number }>> = []
  return pills.map((pill) => {
    const left = pill.center - pill.width / 2
    const right = left + pill.width
    for (let row = 0; ; row += 1) {
      const taken = rows[row] ?? (rows[row] = [])
      if (taken.every((other) => right + gap <= other.left || left - gap >= other.right)) {
        taken.push({ left, right })
        return row
      }
    }
  })
}

/** Étiquettes horizontales (y en px, du haut vers le bas) : au-dessus de la ligne, sinon en dessous si elle toucherait la précédente. */
export function placeHorizontalLabels(ys: number[], height: number): Array<'above' | 'below'> {
  let previousBottom = -Infinity
  return ys.map((y) => {
    if (y - height - 2 >= previousBottom + 2) {
      previousBottom = y - 2
      return 'above'
    }
    previousBottom = y + 2 + height
    return 'below'
  })
}

export interface PciLabelPoint {
  x: number
  y: number
  /** La droite sort par le haut du domaine plutôt que par la droite. */
  exitsTop: boolean
}

/** Point (en coordonnées de données) où poser le libellé d'une droite PCI. */
export function getPciLabelPoint(pci: number, xMax: number, yMax: number, topInset = 3): PciLabelPoint {
  const slope = pciPower(pci, 1)
  const atRight = slope * xMax
  if (atRight <= yMax) return { x: xMax, y: atRight, exitsTop: false }
  const y = yMax - topInset
  return { x: y / slope, y, exitsTop: true }
}

/** Largeur approximative (px) d'une pill de texte. */
export function pillWidth(text: string, charWidth = 5.6, padding = 12): number {
  return Math.ceil(text.length * charWidth + padding)
}

export interface CurrentLabelPlacement {
  side: 'right' | 'left'
  vertical: 'above' | 'below'
  /** Coin supérieur gauche de la pill */
  x: number
  y: number
  /** Petit trait qui relie le losange à la pill */
  stub: { x1: number; y1: number; x2: number; y2: number }
}

/**
 * Pill « Actuel » : au-dessus à droite du point par défaut ; bascule à gauche si elle sortirait
 * du tracé par la droite, et en dessous si elle sortirait par le haut.
 */
export function placeCurrentLabel(
  cx: number,
  cy: number,
  width: number,
  box: { right: number; top: number },
  height = 15,
  offset = 12,
): CurrentLabelPlacement {
  const side = cx + offset + width <= box.right ? 'right' : 'left'
  const vertical = cy - offset - height >= box.top ? 'above' : 'below'
  const dx = side === 'right' ? 1 : -1
  const dy = vertical === 'above' ? -1 : 1
  return {
    side,
    vertical,
    x: side === 'right' ? cx + offset : cx - offset - width,
    y: vertical === 'above' ? cy - offset - height : cy + offset,
    stub: { x1: cx + dx * 4, y1: cy + dy * 4, x2: cx + dx * offset, y2: cy + dy * offset },
  }
}

/** Sous cette largeur de carte, le diagramme passe en mode compact (moins de détails). */
export const COMPACT_BELOW_WIDTH = 480

// --------------------------------------------------------------------------
// Gestionnaire de collisions des étiquettes du diagramme
// --------------------------------------------------------------------------

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export interface LabelCandidate<T = string> {
  id: T
  /** Positions possibles, de la plus souhaitée à la moins souhaitée. */
  positions: Box[]
}

export interface PlacedLabel<T = string> {
  id: T
  /** Boîte retenue, ou `null` si le label est masqué (affiché au survol). */
  box: Box | null
}

function overlaps(a: Box, b: Box, gap = 2): boolean {
  return !(a.x + a.width + gap <= b.x || b.x + b.width + gap <= a.x || a.y + a.height + gap <= b.y || b.y + b.height + gap <= a.y)
}

/**
 * Place une liste d'étiquettes par ordre de priorité. Chaque étiquette prend sa première
 * position candidate qui ne chevauche aucune déjà placée ; si aucune ne convient, elle est masquée.
 */
export function placeLabels<T>(candidates: LabelCandidate<T>[], gap = 2): PlacedLabel<T>[] {
  const placed: Box[] = []
  return candidates.map((candidate) => {
    const box = candidate.positions.find((option) => placed.every((other) => !overlaps(option, other, gap))) ?? null
    if (box) placed.push(box)
    return { id: candidate.id, box }
  })
}

/** Génère les 4 coins candidats (ordre : haut-droite, haut-gauche, bas-droite, bas-gauche) autour d'un point. */
export function cornerPositions(cx: number, cy: number, width: number, height: number, offset = 12): Box[] {
  return [
    { x: cx + offset, y: cy - offset - height, width, height },
    { x: cx - offset - width, y: cy - offset - height, width, height },
    { x: cx + offset, y: cy + offset, width, height },
    { x: cx - offset - width, y: cy + offset, width, height },
  ]
}

export interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
}

function segmentsCrossBox(box: Box, segments: Segment[]): number {
  const { x, y, width, height } = box
  const edges: Segment[] = [
    { x1: x, y1: y, x2: x + width, y2: y },
    { x1: x + width, y1: y, x2: x + width, y2: y + height },
    { x1: x + width, y1: y + height, x2: x, y2: y + height },
    { x1: x, y1: y + height, x2: x, y2: y },
  ]
  const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
    (cy - ay) * (bx - ax) > (by - ay) * (cx - ax)
  const intersects = (a: Segment, b: Segment) =>
    ccw(a.x1, a.y1, b.x1, b.y1, b.x2, b.y2) !== ccw(a.x2, a.y2, b.x1, b.y1, b.x2, b.y2) &&
    ccw(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1) !== ccw(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2)
  return segments.reduce((count, segment) => count + edges.filter((edge) => intersects(edge, segment)).length, 0)
}

/**
 * Choisit, parmi 4 coins, celui dont la pill « Actuel » croise le moins de courbes :
 * ainsi le label ne passe (presque) jamais sur un tracé.
 */
export function pickCurrentCorner(corners: Box[], curves: Segment[]): Box {
  let best = corners[0]
  let bestScore = Number.POSITIVE_INFINITY
  for (const corner of corners) {
    const score = segmentsCrossBox(corner, curves)
    if (score < bestScore) {
      best = corner
      bestScore = score
    }
    if (score === 0) break
  }
  return best
}
