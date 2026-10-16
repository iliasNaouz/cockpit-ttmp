import { MODULE_ORDER, MODULES } from '@/auth/modules'
import { getRoleDefault } from '@/auth/permissions'
import { MODULE_ICONS } from '@/components/shared/module-icons'
import { ACCESS_LEVEL_STYLES } from '@/design-system/status-styles'
import { cn } from '@/lib/utils'
import type { AccessLevel, AccessOverrides, ModuleId, Role } from '@/types/auth'

const LEVELS: AccessLevel[] = ['aucun', 'lecture', 'ecriture']

interface ModuleAccessMatrixProps {
  role: Role
  overrides: AccessOverrides
  /** `undefined` rétablit le défaut du rôle. */
  onChange?: (module: ModuleId, level: AccessLevel | undefined) => void
  readOnly?: boolean
}

/** Une ligne par module : segmented control Aucun / Lecture / Écriture et marqueur de surcharge. */
export function ModuleAccessMatrix({ role, overrides, onChange, readOnly = false }: ModuleAccessMatrixProps) {
  return (
    <ul className="divide-y divide-line-soft rounded-lg border border-line">
      {MODULE_ORDER.map((module) => {
        const Icon = MODULE_ICONS[module]
        const defaultLevel = getRoleDefault(role, module)
        const level = overrides[module] ?? defaultLevel
        const overridden = level !== defaultLevel

        return (
          <li key={module} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <Icon className="size-4 text-ink-sub" aria-hidden />
                {MODULES[module].label}
                {overridden && <span className="size-1.5 rounded-full bg-warning-dot" role="img" aria-label="Surchargé" />}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-mute">
                par défaut : {ACCESS_LEVEL_STYLES[defaultLevel].label.toLowerCase()}
                {overridden && !readOnly && (
                  <button type="button" onClick={() => onChange?.(module, undefined)} className="ml-2 text-brand hover:underline">
                    Rétablir le défaut
                  </button>
                )}
              </p>
            </div>
            <div role="radiogroup" aria-label={`Accès ${MODULES[module].label}`} className="inline-flex rounded-lg bg-surface-muted p-0.5">
              {LEVELS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={level === option}
                  disabled={readOnly}
                  onClick={() => onChange?.(module, option)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs transition-colors disabled:cursor-default',
                    level === option ? 'bg-surface font-semibold text-brand-hover shadow-tab' : 'text-ink-sub hover:text-ink-body disabled:hover:text-ink-sub',
                  )}
                >
                  {ACCESS_LEVEL_STYLES[option].label}
                </button>
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
