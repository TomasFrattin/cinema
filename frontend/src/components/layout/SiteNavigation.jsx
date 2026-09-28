import { Link } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Cartelera/Programación', href: '/cartelera' },
  { label: 'Próximos Estrenos', href: '/proximos-estrenos' },
  { label: 'Candy Shop', href: '/candy-shop', className: 'site-navigation-candy', badge: 'WIP' },
  { label: 'Contacto', href: '/contacto' },
]

function SiteNavigation({ includeTerms = false, ariaLabel }) {
  const items = includeTerms
    ? [...navigationItems, { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' }]
    : navigationItems

  return (
    <nav className="site-navigation" aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link className={item.className} to={item.href}>
              {item.label}
              {item.badge && <span className="site-navigation-badge">{item.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SiteNavigation