import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Recommendation } from '@/types/domain'

export const RECO_PARAM = 'reco'

/**
 * Reco sélectionnée, synchronisée avec `?reco=<timestamp>` : lien partageable,
 * rechargement qui rouvre le panneau, retour arrière qui le ferme.
 */
export function useRecoSelection(recos: Recommendation[]) {
  const [params, setParams] = useSearchParams()
  const timestamp = params.get(RECO_PARAM)

  const selected = useMemo(
    () => (timestamp ? (recos.find((reco) => reco.timestamp === timestamp) ?? null) : null),
    [recos, timestamp],
  )

  const select = useCallback(
    (reco: Recommendation, options: { replace?: boolean } = {}) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          next.set(RECO_PARAM, reco.timestamp)
          return next
        },
        { replace: options.replace ?? false },
      )
    },
    [setParams],
  )

  const clear = useCallback(() => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete(RECO_PARAM)
        return next
      },
      { replace: true },
    )
  }, [setParams])

  return { selected, select, clear }
}
