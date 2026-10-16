import { useState } from 'react'
import { DiagnosticPanel } from './components/DiagnosticPanel'
import { KpiStrip } from './components/KpiStrip'
import { LeverSliders } from './components/LeverSliders'
import { TtmpChartCard } from './components/TtmpChartCard'
import { TtmpChatBar } from './components/TtmpChatBar'
import { TtmpChatSheet, type ChatRequest } from './components/TtmpChatSheet'
import { TtmpHeader } from './components/TtmpHeader'

/**
 * Tableau de bord compact : en-tête, bande de 5 KPI, puis colonne gauche 1/3 (leviers, diagramme)
 * et colonne droite 2/3 (diagnostic). L'ordre des blocs ne change qu'en mode téléphone (< 768px) :
 * les colonnes s'empilent alors. Au-dessus de 1280×760 la page tient dans la fenêtre sans scroll ;
 * entre les deux, la disposition reste la même et la page défile.
 */
export function TtmpPage() {
  const [request, setRequest] = useState<ChatRequest | null>(null)

  return (
    <div className="flex flex-col gap-2.5 p-3 desktop-fit:h-dvh desktop-fit:overflow-hidden">
      <TtmpHeader />
      <KpiStrip />
      <div className="grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-3 desktop-fit:min-h-0 desktop-fit:flex-1 desktop-fit:grid-rows-1">
        <div className="flex min-h-0 min-w-0 flex-col gap-2.5 md:col-span-1">
          <LeverSliders className="shrink-0" />
          <TtmpChartCard className="min-h-[360px] desktop-fit:min-h-0 desktop-fit:flex-1" />
        </div>
        <DiagnosticPanel className="min-h-[460px] md:col-span-2 desktop-fit:min-h-0" />
      </div>
      <TtmpChatBar onSend={(question) => setRequest({ id: Date.now(), question })} />
      <TtmpChatSheet request={request} onClose={() => setRequest(null)} />
    </div>
  )
}
