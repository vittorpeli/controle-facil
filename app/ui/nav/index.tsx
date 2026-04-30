import type { User } from '~/features/auth/core/user'
import { NavItem } from './NavItem'
import { UserIcon } from './UserIcon'

export interface NavProps {
  title: string
  subtitle?: string
  userData: User
  pages?: {
    label: string
    to: string
    icon?: React.ReactNode
  }[]
}

export function Nav({ title, subtitle, userData, pages }: NavProps) {
  return (
    <nav className="nav flow flow-space-m wrapper py-xs">
      <div>
        <h1 className="nav__title cluster">{title}</h1>
        <p className="nav__subtitle">{subtitle}</p>
      </div>
      <UserIcon name={userData.name} />
      <div>
        <ul className="nav__items flow">
          {pages?.map((page) => (
            <NavItem
              key={page.to}
              label={page.label}
              to={page.to}
              icon={page.icon}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
}
