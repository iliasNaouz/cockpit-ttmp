import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@/auth/auth-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/data/services/api'
import { DemoAccounts } from './DemoAccounts'
import type { DemoAccount } from './demo-accounts'
import { ForgotPasswordDialog } from './ForgotPasswordDialog'
import { loginSchema, REMEMBER_EMAIL_KEY, type LoginValues } from './login-schema'
import { MicrosoftButton } from './MicrosoftButton'

function readRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? ''
  } catch {
    return ''
  }
}

function rememberEmail(email: string | null): void {
  try {
    if (email) localStorage.setItem(REMEMBER_EMAIL_KEY, email)
    else localStorage.removeItem(REMEMBER_EMAIL_KEY)
  } catch {
    // stockage indisponible : on ignore
  }
}

function toMessage(error: unknown): string {
  if (error instanceof ApiError && error.code === 'account_disabled') {
    return 'Ce compte est désactivé. Contactez un administrateur.'
  }
  return 'Email ou mot de passe incorrect.'
}

export function LoginForm() {
  const { login, loginWithMicrosoft } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const remembered = readRememberedEmail()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: remembered, password: '', remember: remembered !== '' },
  })

  const run = async (action: () => Promise<void>) => {
    setError(null)
    try {
      await action()
    } catch (caught) {
      setError(toMessage(caught))
    }
  }

  const onSubmit = handleSubmit((values) =>
    run(async () => {
      await login(values.email, values.password)
      rememberEmail(values.remember ? values.email : null)
    }),
  )

  const fillDemo = (account: DemoAccount) => {
    setValue('email', account.email, { shouldValidate: true })
    setValue('password', account.password, { shouldValidate: true })
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-line bg-surface p-8 shadow-card">
      <h1 className="text-2xl font-bold text-ink">Connexion</h1>
      <p className="mt-1 text-[13px] text-ink-sub">Accédez à votre espace de supervision.</p>

      <div className="mt-6">
        <MicrosoftButton disabled={isSubmitting} onClick={() => void run(loginWithMicrosoft)} />
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] uppercase text-ink-mute">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={(event) => void onSubmit(event)} noValidate className="space-y-4">
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] font-semibold">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-mute" aria-hidden />
            <Input id="email" type="email" autoComplete="email" className="h-10 pl-9" aria-invalid={!!errors.email} {...register('email')} />
          </div>
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] font-semibold">Mot de passe</Label>
            <ForgotPasswordDialog />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-mute" aria-hidden />
            <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="h-10 px-9" aria-invalid={!!errors.password} {...register('password')} />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-mute hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand"
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-ink-body">
              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
              Se souvenir de moi
            </label>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="h-10 w-full bg-brand text-sm font-semibold text-white hover:bg-brand-hover">
          {isSubmitting ? (<><Loader2 className="animate-spin" aria-hidden /> Connexion…</>) : 'Se connecter'}
        </Button>
      </form>

      {import.meta.env.DEV && <DemoAccounts onPick={fillDemo} />}
    </div>
  )
}
