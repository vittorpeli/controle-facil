import {
  ArrowLeftRight,
  Goal,
  House,
  Newspaper,
  WalletCards,
} from 'lucide-react'
import { Outlet, useRouteLoaderData } from 'react-router'
import type { User } from '~/features/auth/core/user'
import { requireAuth } from '~/features/auth/services/require-auth'
import { Nav } from '~/ui/nav'
import type { Route } from './+types/app'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)
  return { user }
}

export function useAuthenticatedUser(): User {
  const data = useRouteLoaderData<typeof loader>('routes/app')
  if (!data?.user)
    throw new Error('useAuthenticatedUser used outside of /app/* routes')
  return data.user
}

const navPages = [
  { label: 'Dashboard', to: '/app', icon: <House /> },
  { label: 'Transações', to: '/app/transactions', icon: <ArrowLeftRight /> },
  { label: 'Orçamentos', to: '/app/orçamentos', icon: <WalletCards /> },
  { label: 'Metas', to: '/app/metas', icon: <Goal /> },
  { label: 'Relatórios', to: '/app/relatorios', icon: <Newspaper /> },
]

export default function AppLayout() {
  const user = useAuthenticatedUser()

  return (
    <div
      className="sidebar h-screen"
      style={{ '--sidebar-target-width': '12rem' } as React.CSSProperties}
    >
      <Nav
        title="Controle Fácil"
        subtitle="O Seu Sistema Financeiro"
        userData={user}
        pages={navPages}
      />
      <div className="wrapper flow my-xs">
        <Outlet />
      </div>
    </div>
  )
}
