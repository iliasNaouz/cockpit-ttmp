import type { AgentHealth, TelemetryPoint } from '@/types/domain'
import { RECOMMENDATIONS } from './recommendations'

export const STEAM_SETPOINT = 40.0

export const TELEMETRY: TelemetryPoint[] = RECOMMENDATIONS.map((reco) => ({
  timestamp: reco.timestamp,
  time: reco.timestamp.slice(11, 19),
  actual: reco.actualSteam,
  predicted: reco.predictedSteam,
  setpoint: STEAM_SETPOINT,
  o2: reco.o2,
  grille: reco.grillePct,
  poussoir: reco.poussoirPct,
}))

export const AGENT_HEALTH: AgentHealth = {
  operationalPct: 98,
  timestamps: RECOMMENDATIONS.length,
  timeouts: RECOMMENDATIONS.filter((reco) => reco.lever === 'Timeout Error').length,
  window: 'Nominal',
}
