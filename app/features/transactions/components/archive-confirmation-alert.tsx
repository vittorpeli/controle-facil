import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import type { Account } from '../core/account'
import { archiveAccountSchema } from '../services/schemas/archive-account-schema'

interface ConfirmationAlertProps {
  message?: string
  onCancel: () => void
  isOpen: boolean
  account: Account | null
}

export function ArchiveConfirmationAlert({
  message,
  onCancel,
  isOpen,
  account,
}: ConfirmationAlertProps) {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(archiveAccountSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: archiveAccountSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  if (!isOpen || !account) return null

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
          <fetcher.Form method="post" id={form.id} onSubmit={form.onSubmit}>
            <input type="hidden" name="intent" value="archive-account" />

            <input
              type="hidden"
              name={fields.accountId.name}
              value={account.id}
            />

            <Button
              type="submit"
              className="bg-error hover:bg-red-700 transition"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? 'Arquivando...' : 'Sim'}
            </Button>
          </fetcher.Form>
        </div>
        <p className="text-error text-step--2">{fields.accountId.errors}</p>
      </div>
    </div>
  )
}
