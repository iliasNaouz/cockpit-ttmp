import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSite } from '@/contexts/site-store'
import * as api from '@/data/services/api'
import type { Evaluation } from '@/types/domain'

/** Envoie l'évaluation du diagnostic puis confirme par un toast. */
export function useEvaluation(onSaved?: () => void) {
  const { siteId } = useSite()

  return useMutation({
    mutationFn: (evaluation: Evaluation) => api.submitEvaluation(siteId, evaluation),
    onSuccess: () => {
      toast.success('Évaluation enregistrée')
      onSaved?.()
    },
    onError: () => toast.error("Impossible d'enregistrer l'évaluation"),
  })
}
