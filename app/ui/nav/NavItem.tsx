import { NavLink } from "react-router"

export function NavItem({
  label,
  to,
  icon,
}: {
  label: string
  to: string
  icon?: React.ReactNode
}) {
  return (
    <li className="nav__item">
      {icon}
      <NavLink to={to}>{label}</NavLink>
    </li>
  )
}