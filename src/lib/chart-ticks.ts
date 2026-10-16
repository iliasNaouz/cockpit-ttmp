/** Garde une étiquette sur `every` (première incluse) et toujours la dernière, pour alléger l'axe X. */
export function selectTicks(labels: string[], every: number): string[] {
  const ticks = labels.filter((_, index) => index % every === 0)
  const last = labels[labels.length - 1]
  if (last !== undefined && ticks[ticks.length - 1] !== last) ticks.push(last)
  return ticks
}

/** Suite de valeurs de `start` à `end` incluse, par pas de `step`. */
export function range(start: number, end: number, step: number): number[] {
  const values: number[] = []
  for (let value = start; value <= end + step / 1000; value += step) {
    values.push(Number(value.toFixed(6)))
  }
  return values
}
