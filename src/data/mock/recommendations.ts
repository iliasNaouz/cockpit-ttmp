import type { Direction, Recommendation, RecommendedLever } from '@/types/domain'

const pad = (n: number): string => String(n).padStart(2, '0')
const round = (value: number, digits: number): number => Number(value.toFixed(digits))

/**
 * Séquence des 50 leviers recommandés (04:46 → 05:35).
 * Répartition : Poussoir 15, Air Secondaire 13, Action Manuelle 10, Grille 9,
 * Pression_Z2 2, Timeout Error 1 (compté dans « Non défini »).
 */
const P = 'Poussoir'
const AS = 'Air Secondaire'
const AM = 'Action Manuelle'
const G = 'Grille'
const Z2 = 'Pression_Z2'
const TO = 'Timeout Error'

const LEVER_SEQUENCE: RecommendedLever[] = [
  AM, P, AS, P, G, TO, P, AS, AM, P,
  AS, G, P, AM, AS, P, Z2, G, AS, P,
  AM, AS, G, P, AS, AM, P, G, AS, P,
  AM, AS, G, P, AM, AS, P, G, AS, Z2,
  P, AM, AS, G, P, AM, AM, P, G, AS,
]

/** Points de contrôle (index minute, vapeur t/h) interpolés linéairement. */
const STEAM_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [0, 40.5],
  [19, 41.5],
  [30, 39.2],
  [38, 39.2],
  [45, 39.8],
  [49, 39.3],
]

function interpolateSteam(index: number): number {
  for (let k = 0; k < STEAM_ANCHORS.length - 1; k += 1) {
    const [x0, y0] = STEAM_ANCHORS[k]
    const [x1, y1] = STEAM_ANCHORS[k + 1]
    if (index >= x0 && index <= x1) {
      return y0 + ((y1 - y0) * (index - x0)) / (x1 - x0)
    }
  }
  return STEAM_ANCHORS[STEAM_ANCHORS.length - 1][1]
}

interface Copy {
  title: string
  description: string
  diagnostic: string
  rationale: string
}

const COPY: Record<RecommendedLever, Copy> = {
  Poussoir: {
    title: 'Ajustement léger du poussoir',
    description:
      "Je te propose d'ajuster légèrement le poussoir en te servant de la tendance vapeur sur les 15 prochaines minutes.",
    diagnostic:
      'Le débit vapeur évolue légèrement au-dessus de la consigne et le PCI estimé reste stable : la charge sur le poussoir (ROU_0312) peut être ajustée sans risque pour la combustion.',
    rationale:
      "Le poussoir pilote l'alimentation en déchets : un ajustement de faible amplitude agit sur la vapeur avec un retard d'environ 15 minutes, cohérent avec la prédiction du modèle.",
  },
  'Air Secondaire': {
    title: "Modulation de l'air secondaire",
    description:
      "Le four est en zone sous-charge avec un PCI inférieur à 1 500 kcal/kg : moduler l'air secondaire pour stabiliser la combustion.",
    diagnostic:
      "Le four est en zone sous-charge avec un PCI inférieur à 1 500 kcal/kg ; l'oxygène des fumées (ROU_0449) reste proche de son seuil bas.",
    rationale:
      "L'air secondaire permet de stabiliser la combustion sans modifier le débit de déchets : c'est le levier le plus rapide pour corriger l'oxygène.",
  },
  'Action Manuelle': {
    title: 'Action manuelle conseillée',
    description:
      "Je te propose une intervention manuelle ponctuelle : la régulation automatique ne suffit pas à absorber l'écart actuel.",
    diagnostic:
      "L'écart avec la consigne persiste malgré la régulation automatique, ce qui indique une perturbation que le régulateur ne compense pas seul.",
    rationale:
      "Une intervention manuelle ponctuelle de l'opérateur évite une dérive prolongée, la régulation reprenant ensuite la main.",
  },
  Grille: {
    title: 'Réglage de la vitesse de grille',
    description:
      "Je te propose de ralentir la grille d'un pas pour garder le front de combustion en zone 2.",
    diagnostic:
      "Le front de combustion se déplace vers la fin de grille ; la vitesse de grille actuelle ne suit plus la charge entrante (ROU_0128).",
    rationale:
      "Ralentir la grille d'un pas maintient la combustion en zone 2 et limite les imbrûlés.",
  },
  Pression_Z2: {
    title: 'Surveillance de la pression zone 2',
    description:
      "Surveiller la pression en zone 2 et ajuster la dépression foyer si l'écart persiste.",
    diagnostic:
      "La pression en zone 2 s'éloigne de sa valeur nominale sans impact immédiat sur la vapeur.",
    rationale:
      "Surveiller la pression Z2 permet d'anticiper un déséquilibre de tirage avant qu'il n'affecte la production.",
  },
  'Non défini': {
    title: 'Aucune action définie',
    description:
      "Aucune action recommandée en l'absence de données exploitables sur la fenêtre courante.",
    diagnostic:
      'Les données disponibles sur la fenêtre courante sont insuffisantes pour qualifier la situation.',
    rationale:
      "En l'absence de données fiables, l'agent s'abstient de recommander une action afin de ne pas dégrader le procédé.",
  },
  'Timeout Error': {
    title: 'Timeout Error',
    description: 'API Connection timeout',
    diagnostic: 'API Connection timeout',
    rationale: '',
  },
}

const DIRECTIONS: Direction[] = ['Up', 'Down', 'Hold']

function buildRecommendation(index: number): Recommendation {
  const lever = LEVER_SEQUENCE[index]
  const totalMinutes = 46 + index
  const timestamp = `2026-04-08T${pad(4 + Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}:00`
  const isTimeout = lever === 'Timeout Error'
  const isLast = index === LEVER_SEQUENCE.length - 1

  const actual = round(interpolateSteam(index) + 0.06 * Math.sin(index * 2.3), 2)
  const predicted = round(40.175 + 0.27 * Math.sin(index * 0.7), 2)
  const direction: Direction = isLast ? 'Down' : DIRECTIONS[(index * 7 + 1) % 3]

  return {
    id: `reco-${pad(index + 1)}`,
    timestamp,
    actualSteam: isTimeout ? null : actual,
    predictedSteam: isTimeout ? null : isLast ? 40.14 : predicted,
    o2: isTimeout ? null : round(6.0 + 0.6 * Math.sin(index * 0.9 + 1), 2),
    lever,
    direction: isTimeout ? 'Hold' : direction,
    grillePct: round(47.1 + 4 * Math.sin(index * 0.5), 1),
    poussoirPct: round(29.1 + 2.5 * Math.sin(index * 0.4), 1),
    tag: isLast ? 'ROU_0449' : `ROU_0${400 + ((index * 37) % 100)}`,
    title: COPY[lever].title,
    description: COPY[lever].description,
    diagnostic: COPY[lever].diagnostic,
    rationale: COPY[lever].rationale,
    consigne: 40,
    airPrimaireRpm: isTimeout ? null : round(1258.2 + 30 * Math.sin(index * 0.3), 1),
    airSecondaireRpm: isTimeout ? null : round(12390.2 + 120 * Math.sin(index * 0.4), 1),
    pressionZ2: isTimeout ? null : round(10.27 + 0.3 * Math.sin(index * 0.6), 2),
    pressionZ3: isTimeout ? null : round(10.31 + 0.3 * Math.sin(index * 0.5), 2),
  }
}

export const RECOMMENDATIONS: Recommendation[] = LEVER_SEQUENCE.map((_, index) =>
  buildRecommendation(index),
)
