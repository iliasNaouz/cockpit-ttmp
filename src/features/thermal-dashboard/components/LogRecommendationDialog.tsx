import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePermission } from '@/auth/usePermission'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LEVER_ORDER } from '@/design-system/lever-styles'
import { useRecommendationMutations } from '../hooks/useThermalData'

const schema = z.object({
  lever: z.enum(LEVER_ORDER),
  direction: z.enum(['Up', 'Down', 'Hold']),
  title: z.string().min(3, 'Titre requis (3 caractères minimum)'),
  description: z.string().min(5, 'Description requise (5 caractères minimum)'),
})

type Values = z.infer<typeof schema>

const LEVER_OPTIONS = LEVER_ORDER.map((lever) => ({ value: lever, label: lever }))
const DIRECTION_OPTIONS = [
  { value: 'Up' as const, label: 'Up' },
  { value: 'Down' as const, label: 'Down' },
  { value: 'Hold' as const, label: 'Hold' },
]

/** Bouton « + Log Recommendation » et son formulaire (désactivé en lecture seule). */
export function LogRecommendationDialog() {
  const { canWrite } = usePermission('thermal')
  const { log } = useRecommendationMutations()
  const [open, setOpen] = useState(false)
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { lever: 'Poussoir', direction: 'Hold', title: '', description: '' },
  })

  const onSubmit = handleSubmit((values) =>
    log.mutateAsync(values).then(() => {
      reset()
      setOpen(false)
    }),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ReadOnlyGuard canWrite={canWrite}>
        <DialogTrigger render={<Button disabled={!canWrite} className="h-9 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover" />}>
          <Plus aria-hidden />
          Log Recommendation
        </DialogTrigger>
      </ReadOnlyGuard>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Recommendation</DialogTitle>
          <DialogDescription>Ajoutez manuellement une recommandation au journal opérationnel.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-3" noValidate>
          <div className="flex flex-wrap gap-2">
            <Controller control={control} name="lever" render={({ field }) => <FilterSelect label="Levier" value={field.value} options={LEVER_OPTIONS} onChange={field.onChange} />} />
            <Controller control={control} name="direction" render={({ field }) => <FilterSelect label="Action" value={field.value} options={DIRECTION_OPTIONS} onChange={field.onChange} />} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reco-title">Titre</Label>
            <Input id="reco-title" {...register('title')} aria-invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reco-description">Description</Label>
            <Textarea id="reco-description" rows={3} {...register('description')} aria-invalid={!!errors.description} />
            {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={log.isPending} className="bg-brand text-white hover:bg-brand-hover">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
