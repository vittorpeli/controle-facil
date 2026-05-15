import type { UUID } from 'node:crypto'

export type Category = {
  id: UUID
  userId: UUID
  name: string
  parentId: UUID
  isDefault: boolean
  isArchived: boolean
  createdAt: Date
}
