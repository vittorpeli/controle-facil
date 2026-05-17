import type { Recurrence } from "../core/recurrence"

export function getNextDueDate(recurrence: Recurrence): Date {
  const now = new Date()

  switch (recurrence.frequency) {
    case 'daily': {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    }

    case 'weekly': {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
    }

    case 'biweekly': {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14)
    }

    case 'monthly': {
      const dueDay = recurrence.dueDay ?? 1

      const nextDueDate = new Date(now.getFullYear(), now.getMonth(), dueDay)

      if (nextDueDate < now) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)
      }

      return nextDueDate
    }

    case 'yearly': {
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    }
  }

  return now
}