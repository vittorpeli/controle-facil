import { Outlet, useRouteLoaderData } from 'react-router'
import type { User } from '~/features/auth/core/user'
import { requireAuth } from '~/features/auth/services/require-auth'
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

export default function AppLayout() {
  return <Outlet />
}
