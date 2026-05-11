export function Header({
  subtitle,
  title,
  children,
  ...props
}: {
  subtitle: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <header className="header" {...props}>
      <p className="header__subtitle">{subtitle}</p>
      <div className="header__content repel">
        <h1 className="header__title">{title}</h1>
        {children}
      </div>
    </header>
  )
}
