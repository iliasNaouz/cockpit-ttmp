import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { usePermission } from '@/auth/usePermission'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SiteId } from '@/types/domain'
import type { Project } from '@/types/project'
import { useProjectMutations } from '../hooks/useProjects'

const schema = z.object({
  title: z.string().min(3, 'Titre requis (3 caractères minimum)'),
  owner: z.string().min(1),
  phaseId: z.string().min(1),
  dueDate: z.string().min(1, 'Échéance requise'),
})
type Values = z.infer<typeof schema>

/** Bouton « Ajouter un jalon » et son formulaire. */
export function AddMilestoneDialog({ siteId, project }: { siteId: SiteId; project: Project }) {
  const { canWrite } = usePermission('projets')
  const { addMilestone } = useProjectMutations(siteId)
  const [open, setOpen] = useState(false)
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', owner: project.manager.name, phaseId: String(project.currentPhase), dueDate: '' },
  })

  const onSubmit = handleSubmit((values) =>
    addMilestone.mutateAsync({ title: values.title, owner: values.owner, phaseId: Number(values.phaseId), dueDate: values.dueDate }).then(() => {
      toast.success('Jalon ajouté')
      reset()
      setOpen(false)
    }),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ReadOnlyGuard canWrite={canWrite}>
        <DialogTrigger render={<Button disabled={!canWrite} className="h-9 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-brand-hover" />}>
          <Plus aria-hidden /> Ajouter un jalon
        </DialogTrigger>
      </ReadOnlyGuard>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un jalon</DialogTitle>
          <DialogDescription>Le jalon sera rattaché à la phase choisie.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="milestone-title">Titre</Label>
            <Input id="milestone-title" {...register('title')} aria-invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="milestone-date">Échéance</Label>
            <Input id="milestone-date" type="date" {...register('dueDate')} aria-invalid={!!errors.dueDate} />
            {errors.dueDate && <p className="text-xs text-danger">{errors.dueDate.message}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Controller control={control} name="phaseId" render={({ field }) => (
              <FilterSelect label="Phase" value={field.value} onChange={field.onChange} options={project.phases.map((phase) => ({ value: String(phase.id), label: `${phase.id}. ${phase.title}` }))} />
            )} />
            <Controller control={control} name="owner" render={({ field }) => (
              <FilterSelect label="Responsable" value={field.value} onChange={field.onChange} options={project.team.map((member) => ({ value: member.name, label: member.name }))} />
            )} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addMilestone.isPending} className="bg-brand text-white hover:bg-brand-hover">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
