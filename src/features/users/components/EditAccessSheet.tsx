import { useState } from 'react'
import { normalizeOverrides } from '@/auth/permissions'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { StatusDot } from '@/components/shared/StatusDot'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { ROLE_LABELS, ROLE_ORDER } from '@/design-system/role-styles'
import { USER_STATUS_STYLES } from '@/design-system/status-styles'
import { SITES, SITE_IDS } from '@/lib/sites'
import { cn } from '@/lib/utils'
import type { AccessLevel, AccessOverrides, ModuleId, Role, User } from '@/types/auth'
import type { SiteId } from '@/types/domain'
import { useUserMutations } from '../hooks/useUsers'
import { fullName } from '../utils/user-filters'
import { ModuleAccessMatrix } from './ModuleAccessMatrix'

const ROLE_OPTIONS = ROLE_ORDER.map((role) => ({ value: role, label: ROLE_LABELS[role] }))

interface Draft {
  role: Role
  sites: SiteId[]
  overrides: AccessOverrides
}

const toDraft = (user: User): Draft => ({ role: user.role, sites: [...user.sites], overrides: { ...user.overrides } })

function isDirty(user: User, draft: Draft): boolean {
  const sameSites = [...draft.sites].sort().join() === [...user.sites].sort().join()
  const sameOverrides = JSON.stringify(normalizeOverrides(draft.role, draft.overrides)) === JSON.stringify(normalizeOverrides(user.role, user.overrides))
  return draft.role !== user.role || !sameSites || !sameOverrides
}

function SheetBody({ user, onClose }: { user: User; onClose: () => void }) {
  const { updateAccess } = useUserMutations()
  const [draft, setDraft] = useState<Draft>(() => toDraft(user))
  const isAdmin = draft.role === 'administrateur'
  const status = USER_STATUS_STYLES[user.status]

  const setLevel = (module: ModuleId, level: AccessLevel | undefined) =>
    setDraft((previous) => {
      const overrides = { ...previous.overrides }
      if (level === undefined) delete overrides[module]
      else overrides[module] = level
      return { ...previous, overrides }
    })

  const toggleSite = (site: SiteId, checked: boolean) =>
    setDraft((previous) => ({ ...previous, sites: checked ? [...previous.sites, site] : previous.sites.filter((id) => id !== site) }))

  const save = () =>
    updateAccess.mutate(
      { userId: user.id, patch: { role: draft.role, sites: draft.sites, overrides: draft.overrides } },
      { onSuccess: onClose },
    )

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <UserAvatar name={fullName(user)} size="lg" />
          <div className="min-w-0">
            <SheetTitle>{fullName(user)}</SheetTitle>
            <SheetDescription>{user.email}</SheetDescription>
            <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-sub"><StatusDot className={cn(status.dot)} /> {status.label} · <RoleBadge role={user.role} compact /></span>
          </div>
        </div>
      </SheetHeader>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">Rôle</h3>
          <FilterSelect label="Rôle" value={draft.role} options={ROLE_OPTIONS} onChange={(role) => setDraft((previous) => ({ ...previous, role }))} />
        </section>
        <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">Sites autorisés</h3>
          <ul className="space-y-2">
            {SITE_IDS.map((site) => (
              <li key={site}>
                <label className="flex items-center justify-between text-sm text-ink-body">
                  {SITES[site].label}
                  <Switch checked={isAdmin || draft.sites.includes(site)} disabled={isAdmin} onCheckedChange={(checked) => toggleSite(site, checked)} aria-label={`Accès ${SITES[site].label}`} />
                </label>
              </li>
            ))}
          </ul>
          {isAdmin && <p className="mt-2 text-xs text-ink-mute">Les administrateurs ont accès à tous les sites.</p>}
        </section>
        <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">Accès par module</h3>
          <ModuleAccessMatrix role={draft.role} overrides={draft.overrides} onChange={setLevel} />
        </section>
      </div>
      <SheetFooter className="sticky bottom-0 flex-row justify-end border-t border-line bg-surface">
        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
        <Button
          type="button"
          disabled={!isDirty(user, draft) || (!isAdmin && draft.sites.length === 0) || updateAccess.isPending}
          onClick={save}
          className="bg-brand text-white hover:bg-brand-hover"
        >
          Enregistrer les modifications
        </Button>
      </SheetFooter>
    </>
  )
}

/** Panneau latéral (480px) : rôle, sites et surcharges d'accès par module. */
export function EditAccessSheet({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <Sheet open={user !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-4 sm:max-w-[480px]">
        {user && <SheetBody key={user.id} user={user} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  )
}
