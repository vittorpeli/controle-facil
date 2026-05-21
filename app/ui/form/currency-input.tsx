import { useState } from 'react'
import { Input } from '.'

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> {
  name: string
  defaultValue?: string | number | null | unknown
  error?: string | string[]
}

export function CurrencyInput({
  name,
  defaultValue,
  error,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (defaultValue) {
      return Number(defaultValue).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    }
    return ''
  })

  const [rawValue, setRawValue] = useState(() => {
    return defaultValue ? String(defaultValue) : ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const digitsOnly = value.replace(/\D/g, '')

    if (!digitsOnly) {
      setDisplayValue('')
      setRawValue('')
      return
    }

    const numericValue = parseInt(digitsOnly, 10) / 100

    setDisplayValue(
      numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    )
    setRawValue(numericValue.toString())
  }

  return (
    <>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={props.placeholder || 'R$ 0,00'}
      />

      <Input type="hidden" name={name} value={rawValue} />

      {error && <p className="text-error text-step--2">{error}</p>}
    </>
  )
}
