export type SiteId = 'rouen' | 'begles'

export interface Site {
  id: SiteId
  /** Libellé court : « Bègles » */
  label: string
  /** Nom de la ligne : « FC1 Bègles » */
  lineName: string
  /** Nom complet de projet : « Bègles — FC1 » */
  projectName: string
}

export type LeverName =
  | 'Poussoir'
  | 'Air Secondaire'
  | 'Action Manuelle'
  | 'Grille'
  | 'Pression_Z2'
  | 'Non défini'

/** Levier recommandé dans une ligne de log : un levier ou une erreur d'agent. */
export type RecommendedLever = LeverName | 'Timeout Error'

export type Direction = 'Up' | 'Down' | 'Hold'

export type O2Status = 'safe' | 'near' | 'alert'

export interface Recommendation {
  id: string
  /** Format local `YYYY-MM-DDTHH:mm:ss` */
  timestamp: string
  actualSteam: number | null
  predictedSteam: number | null
  o2: number | null
  lever: RecommendedLever
  direction: Direction
  grillePct: number
  poussoirPct: number
  tag: string
  title: string
  /** Texte de la recommandation de l'agent */
  description: string
  /** Diagnostic opérationnel */
  diagnostic: string
  /** Raison métier (process engineering rationale) */
  rationale: string
  consigne: number
  airPrimaireRpm: number | null
  airSecondaireRpm: number | null
  pressionZ2: number | null
  pressionZ3: number | null
}

export interface TelemetryPoint {
  timestamp: string
  /** `HH:mm:ss` */
  time: string
  actual: number | null
  predicted: number | null
  setpoint: number
  o2: number | null
  grille: number
  poussoir: number
}

export interface AgentHealth {
  operationalPct: number
  timestamps: number
  timeouts: number
  window: string
}

export type LeverTab =
  | 'alimentateurs'
  | 'grilles'
  | 'air'
  | 'combustion'
  | 'vapeur'

export interface SliderLever {
  id: string
  tab: LeverTab
  label: string
  value: number
}

export interface TtmpStatus {
  running: boolean
  mode: string
  modeDescription: string
  steamActual: number
  steamSetpoint: number
  stabilityPct: number
  /** O₂ des fumées (%) et seuil bas */
  o2: number
  o2Threshold: number
  /** Point de fonctionnement actuel : débit déchets (t/h) et puissance thermique (MW) */
  wasteFlow: number
  thermalPower: number
}

export interface StabilityPoint {
  time: string
  value: number
  setpoint: number
}

export type Rating = 'up' | 'down'

/** Bloc de diagnostic : un paragraphe court, affiché seul (sans chips ni éléments annexes). */
export interface DiagnosticBlock {
  /** Paragraphe court, 280 caractères max. */
  summary: string
}

export interface Diagnostic {
  diagnostic: DiagnosticBlock
  action: DiagnosticBlock
  rationale: DiagnosticBlock
  generatedAt: string
  /** Date ISO de la dernière génération. */
  updatedAt: string
  /** Textes longs conservés pour l'API, non affichés dans le panneau compact. */
  fullText: { diagnostic: string; action: string; rationale: string }
}

export interface Evaluation {
  diagnostic: Rating
  action: Rating
  rationale: Rating
}
