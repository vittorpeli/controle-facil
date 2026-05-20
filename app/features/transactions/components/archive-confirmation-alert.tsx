import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import type { Account } from '../core/account'

interface ConfirmationAlertProps {
  message?: string
  onCancel: () => void
  isOpen: boolean
  account: Account
}

export function ArchiveConfirmationAlert({
  message,
  onCancel,
  isOpen,
  account,
}: ConfirmationAlertProps) {
  const fetcher = useFetcher()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50">
      <div className="bg-light rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        {message && (
          <p className="text-dark-glare mb-6 text-step--2">{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} className="mt-4 text-step--2">
            Cancelar
          </Button>
          <fetcher.Form action="post">
            <input type="hidden" name="intent" value="archive-account" />

            <input type="hidden" name="accountId" value={account.id} />

            <Button
              type="submit"
              className="bg-error hover:bg-red-700 transition"
            >
              Sim
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  )
}
