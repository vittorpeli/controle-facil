import type { UUID } from 'node:crypto'
import type { Email } from './email'

export type User = {
  id: UUID
  name: string
  email: Email
  passwordHash: string
  createdAt: Date
}
