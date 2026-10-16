import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAgentHealth } from '../hooks/useThermalData'

export function AgentHealthCard() {
  const { data } = useAgentHealth()

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Agent Health & Stability</h2>
        <CheckCircle2 className="size-5 text-success-dot" aria-hidden />
      </div>
      {data ? (
        <>
          <div className="mt-3 flex items-baseline justify-between">
            <p>
              <span className="text-[28px] font-bold text-ink">{data.operationalPct}%</span>{' '}
              <span className="text-sm text-ink-sub">operational</span>
            </p>
            <MonoValue className="text-sm text-ink-sub">{data.timestamps} timestamps</MonoValue>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm text-ink-sub">
            <span>
              Timeouts / Errors: <MonoValue className="font-semibold text-ink">{data.timeouts}</MonoValue>
            </span>
            <span>
              Window: <span className="font-semibold text-ink">{data.window}</span>
            </span>
          </div>
        </>
      ) : (
        <Skeleton className="mt-3 h-20 w-full" />
      )}
    </Card>
  )
}
