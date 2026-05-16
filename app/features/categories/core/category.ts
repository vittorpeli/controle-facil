import type { UUID } from 'node:crypto'

export type Category = {
  id: UUID
  userId: UUID | null
  name: string
  parentId: UUID | null
  isDefault: boolean
  isArchived: boolean
  createdAt: Date
}
