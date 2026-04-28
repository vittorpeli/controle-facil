import { Outlet } from 'react-router'

export default function Auth() {
  return (
    <div className="auth-layout">
      <main className="sidebar" data-direction="rtl">
        <div className="auth-layout__head wrapper">
          <div className="flow flow-space-2xs">
            <h1 className="font-display">Controle Fácil</h1>
            <p className="text-step--1">
              Organize seu dinheiro de forma fácil, simples e descomplicada
            </p>
          </div>
        </div>
        <div>
          <div className="wrapper my-2xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
