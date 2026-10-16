import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ForgotPasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger
        className="text-xs text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        Mot de passe oublié ?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mot de passe oublié</DialogTitle>
          <DialogDescription>Un lien de réinitialisation vous sera envoyé.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
