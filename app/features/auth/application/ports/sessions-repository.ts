import type { Session } from '../../core/session'

export interface SessionsRepository {
  create(session: Session): Promise<Session>
  findByToken(token: string): Promise<Session | null>
  deleteByToken(token: string): Promise<void>
}
