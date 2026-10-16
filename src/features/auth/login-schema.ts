import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean(),
})

export type LoginValues = z.infer<typeof loginSchema>

export const REMEMBER_EMAIL_KEY = 'vsd.remember-email'
