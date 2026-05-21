import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Copy } from 'lucide-react'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import { createBudgetSchema } from '../http/schemas/create-budget-schema'

export const CopyBudgetLoader = () => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createBudgetSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createBudgetSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return (
    <div className="mt-s-m">
      {fetcher.state === 'idle' ? (
        <fetcher.Form action="post" id={form.id} onSubmit={form.onSubmit}>
          <input type="hidden" name="intent" value="copy-budget" />
          <input type="hidden" name={fields.month.name} value={currentMonth} />
          <input type="hidden" name={fields.year.name} value={currentYear} />

          <Button
            data-button-variant="link"
            type="submit"
            disabled={fetcher.state !== 'idle'}
          >
            <Copy />
            Copiar Orçamentos do Mês Anterior
          </Button>
        </fetcher.Form>
      ) : (
        <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50">
          <div className="bg-light rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            {(form.errors?.length ?? 0) > 0 ? (
              <p className="text-center text-step--2 text-error">
                Ocorreu um erro: {form.errors?.[0] ?? 'Erro desconhecido'}
              </p>
            ) : (
              <div className="flex items-center justify-center gap-m">
                <span className="loader" />
                <p className="text-center text-step--2">
                  Copiando orçamentos...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
