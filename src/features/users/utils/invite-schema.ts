import { z } from 'zod'

export const inviteSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Prénom requis'),
    lastName: z.string().trim().min(1, 'Nom requis'),
    email: z.email('Adresse email invalide'),
    role: z.enum(['administrateur', 'chef_projet', 'operateur', 'lecteur']),
    sites: z.array(z.enum(['rouen', 'begles'])),
  })
  .refine((values) => values.role === 'administrateur' || values.sites.length > 0, {
    path: ['sites'],
    message: 'Sélectionnez au moins un site',
  })

export type InviteValues = z.infer<typeof inviteSchema>
