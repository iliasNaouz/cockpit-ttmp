import { usePermission } from '@/auth/usePermission'
import { Card } from '@/components/shared/Card'
import { EmptyState } from '@/components/shared/EmptyState'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchX } from 'lucide-react'
import type { Recommendation } from '@/types/domain'
import { useRecommendationMutations } from '../hooks/useThermalData'
import { RecommendationRow } from './RecommendationRow'

const COLUMNS = [
  'Timestamp',
  'Actual Steam (t/h)',
  'Predicted +15m',
  'O₂ Level',
  'Recommended Lever',
  'Actuator State (Grille / Poussoir)',
  'Operational Diagnostic & Action',
  'Actions',
]

interface RecommendationsTableProps {
  recos: Recommendation[]
  selectedId: string | undefined
  onOpen: (reco: Recommendation, edit?: boolean) => void
}

export function RecommendationsTable({ recos, selectedId, onOpen }: RecommendationsTableProps) {
  const { canWrite } = usePermission('thermal')
  const { remove } = useRecommendationMutations()

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-line hover:bg-transparent">
            {COLUMNS.map((column) => (
              <TableHead key={column} className="h-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-ink-sub">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recos.map((reco) => (
            <RecommendationRow
              key={reco.id}
              reco={reco}
              canWrite={canWrite}
              selected={reco.id === selectedId}
              onOpen={onOpen}
              onDelete={(target) => remove.mutate(target.id)}
            />
          ))}
        </TableBody>
      </Table>
      {recos.length === 0 && (
        <EmptyState icon={SearchX} title="Aucun log trouvé" description="Aucune recommandation ne correspond aux filtres sélectionnés." />
      )}
    </Card>
  )
}
