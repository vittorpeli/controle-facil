import z from 'zod'

export const deleteGoalSchema = z.object({
  goalId: z.uuidv4(),
})
