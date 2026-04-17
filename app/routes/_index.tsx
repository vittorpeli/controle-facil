import type { Route } from './+types/_index'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Controle Fácil' },
    { name: 'description', content: 'Controle Fácil suas finanças' },
  ]
}

export default function Home() {
  return <h1 className='font-base'>Welcome to React Router!</h1>
}
