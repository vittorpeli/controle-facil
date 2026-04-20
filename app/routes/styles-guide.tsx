import { Link, NavLink, Outlet } from "react-router"

export function meta() {
  return [
    { title: 'Style Guide' },
    { name: 'description', content: 'Design System' },
  ]
}

const SidebarItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
    return <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to={to}>{children}</NavLink></li>
}

export default function StylesGuide() {
    return (
        <div className="styles-guide wrapper">
            <main className="sidebar">
                <nav className="styles-guide__sidebar flow" aria-label="Design System">
                    <div className="styles-guide__sidebar-inner pt-2xl">
                        <h2>Design Tokens</h2>
                        <ul className="styles-guide__nav">
                            <SidebarItem to="/styles-guide/colors">Colors</SidebarItem>
                            <SidebarItem to="/styles-guide/typography">Typography</SidebarItem>
                            <SidebarItem to="/styles-guide/spacing">Spacing</SidebarItem>
                        </ul>
                        <hr />
                        <h2>CSS</h2>
                        <ul className="styles-guide__nav">
                            <SidebarItem to="/styles-guide/compositions">Layout Compositions</SidebarItem>
                            <SidebarItem to="/styles-guide/utilities">Core Utilities</SidebarItem>
                        </ul>
                        <hr />
                        <h2>Components</h2>
                        <ul className="styles-guide__nav">
                            <SidebarItem to="/styles-guide/button">Button</SidebarItem>
                            <SidebarItem to="/styles-guide/card">Card</SidebarItem>
                            <SidebarItem to="/styles-guide/chart">Chart</SidebarItem>
                            <SidebarItem to="/styles-guide/form">Form</SidebarItem>
                            <SidebarItem to="/styles-guide/header">Header</SidebarItem>
                            <SidebarItem to="/styles-guide/headline">Headline</SidebarItem>
                            <SidebarItem to="/styles-guide/nav">Nav</SidebarItem>
                            <SidebarItem to="/styles-guide/panel">Panel</SidebarItem>
                            <SidebarItem to="/styles-guide/quote">Quote</SidebarItem>
                            <SidebarItem to="/styles-guide/table">Table</SidebarItem>
                            <SidebarItem to="/styles-guide/transaction">Transaction</SidebarItem>
                        </ul>
                    </div>
                </nav>
                <div>
                    <div className="wrapper flow prose pt-2xl">
                        <Outlet />
                    </div>
                </div>
            </main>
            <div className="py-m leading-[0.75]">
                <div className="repel">
                    <p>Controle Fácil: Styles Guide</p>
                    <p>
                        <Link to="/">Back to Home ←</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}