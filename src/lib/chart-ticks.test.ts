import { describe, expect, it } from 'vitest'
import { range, selectTicks } from './chart-ticks'

describe('chart-ticks', () => {
  it('sélectionne une étiquette sur n et garde la dernière', () => {
    expect(selectTicks(['a', 'b', 'c', 'd', 'e'], 2)).toEqual(['a', 'c', 'e'])
    expect(selectTicks(['a', 'b', 'c', 'd', 'e', 'f'], 2)).toEqual(['a', 'c', 'e', 'f'])
    expect(selectTicks([], 2)).toEqual([])
  })

  it('génère une suite à pas décimal sans dérive', () => {
    expect(range(38.5, 42, 0.5)).toEqual([38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42])
    expect(range(35.5, 37.5, 0.5)).toEqual([35.5, 36, 36.5, 37, 37.5])
  })
})
