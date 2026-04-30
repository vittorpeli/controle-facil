import type { UUID } from 'node:crypto'

export type Session = {
  id: UUID
  userId: UUID
  token: string
  expiresAt: Date
  createdAt: Date
}
