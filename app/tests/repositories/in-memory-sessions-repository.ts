import type { SessionsRepository } from '~/features/auth/application/ports/sessions-repository'
import type { Session } from '~/features/auth/core/session'

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = []

  async create(session: Session): Promise<Session> {
    this.items.push(session)
    return session
  }

  async findByToken(token: string): Promise<Session | null> {
    return this.items.find((s) => s.token === token) ?? null
  }

  async deleteByToken(token: string): Promise<void> {
    this.items = this.items.filter((s) => s.token !== token)
  }
}
