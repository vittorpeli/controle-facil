import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import type { BudgetProgress } from '../core/budget'

interface ConfirmationAlertProps {
  message?: string
  onCancel: () => void
  isOpen: boolean
  budget?: BudgetProgress
}

export function DeleteBudgetAlert({
  message,
  onCancel,
  isOpen,
  budget,
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
            <input type="hidden" name="intent" value="delete" />

            <input type="hidden" name="budgetId" value={budget?.id} />

            <Button
              type="submit"
              className="bg-error hover:bg-red-700 transition"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? 'Excluindo Orçamento...' : 'Sim'}
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  )
}
