import { describe, expect, it } from 'vitest'
import { assignRows, getPciLabelPoint, placeCurrentLabel, placeHorizontalLabels, pillWidth } from './diagram-layout'

describe('assignRows', () => {
  it('garde la même rangée quand les pills sont éloignées', () => {
    expect(assignRows([{ center: 50, width: 60 }, { center: 200, width: 60 }])).toEqual([0, 0])
  })

  it('décale la pill qui touche la précédente d’une rangée', () => {
    expect(assignRows([{ center: 100, width: 80 }, { center: 140, width: 80 }])).toEqual([0, 1])
  })

  it('remonte en rangée 0 quand la place est libre et cascade sinon', () => {
    const rows = assignRows([{ center: 100, width: 80 }, { center: 120, width: 80 }, { center: 130, width: 80 }, { center: 400, width: 80 }])
    expect(rows).toEqual([0, 1, 2, 0])
  })
})

describe('placeHorizontalLabels', () => {
  it('place au-dessus des lignes espacées', () => {
    expect(placeHorizontalLabels([40, 80, 140], 15)).toEqual(['above', 'above', 'above'])
  })

  it('passe sous la ligne quand l’étiquette toucherait la précédente', () => {
    expect(placeHorizontalLabels([40, 50], 15)).toEqual(['above', 'below'])
  })
})

describe('getPciLabelPoint', () => {
  it('sort à droite quand la droite reste dans le domaine', () => {
    const point = getPciLabelPoint(1400, 14, 35)
    expect(point.exitsTop).toBe(false)
    expect(point.x).toBe(14)
    expect(point.y).toBeCloseTo(22.8, 1)
  })

  it('sort par le haut pour les fortes pentes', () => {
    const point = getPciLabelPoint(3000, 14, 35)
    expect(point.exitsTop).toBe(true)
    expect(point.y).toBe(32)
    expect(point.x).toBeLessThan(14)
  })
})

describe('pillWidth', () => {
  it('croît avec la longueur du texte', () => {
    expect(pillWidth('Pmax 31')).toBeLessThan(pillWidth('Puissance maxi 31 MW'))
  })
})

describe('placeCurrentLabel', () => {
  const box = { right: 300, top: 20 }

  it('place la pill au-dessus à droite par défaut', () => {
    const placement = placeCurrentLabel(100, 100, 46, box)
    expect(placement.side).toBe('right')
    expect(placement.vertical).toBe('above')
    expect(placement.x).toBe(112)
    expect(placement.y).toBe(73)
    expect(placement.stub).toEqual({ x1: 104, y1: 96, x2: 112, y2: 88 })
  })

  it('bascule à gauche quand elle sortirait du tracé', () => {
    const placement = placeCurrentLabel(280, 100, 46, box)
    expect(placement.side).toBe('left')
    expect(placement.x).toBe(280 - 12 - 46)
  })

  it('passe en dessous quand elle sortirait par le haut', () => {
    const placement = placeCurrentLabel(100, 30, 46, box)
    expect(placement.vertical).toBe('below')
    expect(placement.y).toBe(42)
  })
})
