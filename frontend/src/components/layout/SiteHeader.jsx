import SiteNavigation from './SiteNavigation'

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-banner">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/banners/banner_encabezado_mobile.png" />
          <img src="/images/banners/banner_encabezado.png" alt="Cine" />
        </picture>
      </div>
      <SiteNavigation ariaLabel="Navegación principal" />
    </header>
  )
}

export default SiteHeader