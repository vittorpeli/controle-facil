import type { Parsed } from '~/features/shared/parse'

declare const EmailBrand: unique symbol
export type Email = string & { readonly [EmailBrand]: true }

export function parseEmail(raw: string): Parsed<Email> {
  if (!raw.includes('@')) {
    return { kind: 'err', error: { kind: 'ParseError', message: 'missing @' } }
  }
  return { kind: 'ok', value: raw as Email }
}
