import { UserRound } from 'lucide-react'

export function UserIcon({ name }: { name: string }) {
  return (
    <div className="nav__user">
      <div className="nav__user-icon">
        <UserRound />
      </div>
      <div className="nav__user-info">
        <p className="font-base font-bold text-step--1">{name}</p>
      </div>
    </div>
  )
}
