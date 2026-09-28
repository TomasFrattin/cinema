import facebookIcon from '../../assets/icons/facebook.png'
import instagramIcon from '../../assets/icons/instagram.png'
import SiteNavigation from './SiteNavigation'

function SocialLinks() {
  return (
    <section className="footer-social" aria-labelledby="footer-social-title">
      <h2 id="footer-social-title">Redes sociales</h2>
      <ul>
        <li>
          <a
            href="https://www.facebook.com/cineteatro.libertadorii/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            title="Facebook"
          >
            <img className="social-icon" src={facebookIcon} alt="" />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/cinelibertador/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <img className="social-icon" src={instagramIcon} alt="" />
          </a>
        </li>
      </ul>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-navigation">
        <p className="footer-kicker">Explorar</p>
        <SiteNavigation includeTerms ariaLabel="Navegación del pie de página" />
      </div>
      <div className="footer-identity">
        <SocialLinks />
        <div className="footer-brand">
          <img className="footer-logo" src="/images/banners/logo.png" alt="Logo del cine" />
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter