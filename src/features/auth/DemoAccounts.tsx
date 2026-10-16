import { RoleBadge } from '@/components/shared/RoleBadge'
import { DEMO_ACCOUNTS, type DemoAccount } from './demo-accounts'

/** Encadré « Comptes de démo » : un clic pré-remplit le formulaire. */
export function DemoAccounts({ onPick }: { onPick: (account: DemoAccount) => void }) {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-line p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">Comptes de démo</p>
      <ul className="mt-2 space-y-1">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => onPick(account)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{account.name}</span>
                <span className="block truncate font-mono text-[11px] text-ink-sub">{account.email}</span>
              </span>
              <RoleBadge role={account.role} compact />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
