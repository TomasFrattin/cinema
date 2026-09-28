import { Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import SitePricing from './SitePricing'

function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SitePricing />
      <SiteFooter />
    </>
  )
}

export default SiteLayout