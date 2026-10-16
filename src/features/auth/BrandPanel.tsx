import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Logo } from '@/components/layout/Logo'
import { MonoValue } from '@/components/shared/MonoValue'
import { useStability } from '@/features/ttmp/hooks/useTtmpData'

/** Image de fond : remplacez ce fichier de `public/` par une photo (jpg, webp…) en gardant le chemin à jour ici. */
const BACKGROUND_IMAGE = '/login-bg.svg'

function MiniKpi({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <MonoValue className="block text-lg font-bold text-surface">{value}</MonoValue>
      <span className="text-[11px] text-surface/80">{label}</span>
    </div>
  )
}

/** Colonne de marque : image d'usine, voile indigo pour la lisibilité du texte, aperçu vapeur en verre dépoli. */
export function BrandPanel() {
  const { data } = useStability()

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-hover p-10 text-surface lg:flex">
      <img src={BACKGROUND_IMAGE} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
      {/* Voile : plus dense en haut et au centre (logo, titre), plus léger en bas pour laisser voir l'image. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-hover/90 via-brand/70 to-brand-hover/40" aria-hidden />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Enveloppe : dans une colonne flex, l'image seule serait étirée sur toute la largeur. */}
        <div>
          <Logo inverted className="h-10 max-w-none" />
        </div>

        <div>
          <h2 className="max-w-[440px] text-[32px] leading-tight font-bold">
            Pilotez la production de vapeur avec l'IA
          </h2>
          <p className="mt-3 max-w-[440px] text-[15px] text-surface/90">
            Recommandations en temps réel, diagnostics expliqués et suivi du déploiement sur chaque site.
          </p>

          <div className="mt-8 max-w-[440px] rounded-xl border border-surface/20 bg-surface/10 p-4 backdrop-blur">
            <div className="h-[100px]" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data ?? []}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                    fill="var(--color-surface)"
                    fillOpacity={0.12}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-between">
              <MiniKpi value="36.78 t/h" label="Débit vapeur" />
              <MiniKpi value="O₂ 4.23 %" label="Fumées" />
              <MiniKpi value="98 %" label="opérationnel" />
            </div>
          </div>
        </div>

        <p className="text-xs text-surface/70">© 2026 Veolia — Usage interne</p>
      </div>
    </div>
  )
}
