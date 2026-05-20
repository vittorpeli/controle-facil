import type { UUID } from 'node:crypto'
import type { Transaction } from '../../core/transaction'

export interface TransactionListItem extends Transaction {
  category: {
    id: UUID
    name: string
  }
  //   account: {
  //     id: UUID
  //     name: string
  //   }
}
