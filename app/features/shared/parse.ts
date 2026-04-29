type ParseError = { kind: 'ParseError'; message: string }
export type Parsed<T> =
  | { kind: 'ok'; value: T }
  | { kind: 'err'; error: ParseError }
