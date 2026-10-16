import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { usePermission } from '@/auth/usePermission'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_LABELS, ROLE_ORDER } from '@/design-system/role-styles'
import { SITES, SITE_IDS } from '@/lib/sites'
import { useUserMutations } from '../hooks/useUsers'
import { inviteSchema, type InviteValues } from '../utils/invite-schema'
import { ModuleAccessMatrix } from './ModuleAccessMatrix'

const ROLE_OPTIONS = ROLE_ORDER.map((role) => ({ value: role, label: ROLE_LABELS[role] }))

export function InviteUserDialog() {
  const { canWrite } = usePermission('utilisateurs')
  const { invite } = useUserMutations()
  const [open, setOpen] = useState(false)
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { firstName: '', lastName: '', email: '', role: 'operateur', sites: [] },
  })
  const role = useWatch({ control, name: 'role' })
  const isAdmin = role === 'administrateur'

  const onSubmit = handleSubmit((values) =>
    invite
      .mutateAsync({ ...values, sites: isAdmin ? [...SITE_IDS] : values.sites })
      .then(() => {
        reset()
        setOpen(false)
      })
      .catch(() => undefined),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ReadOnlyGuard canWrite={canWrite}>
        <DialogTrigger render={<Button disabled={!canWrite} className="h-9 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-brand-hover" />}>
          <UserPlus aria-hidden /> Inviter un utilisateur
        </DialogTrigger>
      </ReadOnlyGuard>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Inviter un utilisateur</DialogTitle>
          <DialogDescription>Un email d'invitation sera envoyé à la personne.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-3" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-first">Prénom</Label>
              <Input id="invite-first" {...register('firstName')} aria-invalid={!!errors.firstName} />
              {errors.firstName && <p className="text-xs text-danger">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-last">Nom</Label>
              <Input id="invite-last" {...register('lastName')} aria-invalid={!!errors.lastName} />
              {errors.lastName && <p className="text-xs text-danger">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input id="invite-email" type="email" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <Controller control={control} name="role" render={({ field }) => (
            <FilterSelect label="Rôle" value={field.value} options={ROLE_OPTIONS} onChange={(value) => { field.onChange(value); if (value === 'administrateur') setValue('sites', [...SITE_IDS]) }} />
          )} />
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink">Sites</legend>
            <Controller control={control} name="sites" render={({ field }) => (
              <div className="flex gap-4">
                {SITE_IDS.map((site) => (
                  <label key={site} className="flex items-center gap-2 text-sm text-ink-body">
                    <Checkbox
                      checked={isAdmin || field.value.includes(site)}
                      disabled={isAdmin}
                      onCheckedChange={(checked) => field.onChange(checked ? [...field.value, site] : field.value.filter((id) => id !== site))}
                    />
                    {SITES[site].label}
                  </label>
                ))}
              </div>
            )} />
            {errors.sites && <p className="mt-1 text-xs text-danger">{errors.sites.message}</p>}
          </fieldset>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-mute">Accès par défaut pour ce rôle</p>
            <ModuleAccessMatrix role={role} overrides={{}} readOnly />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={invite.isPending} className="bg-brand text-white hover:bg-brand-hover">Envoyer l'invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
