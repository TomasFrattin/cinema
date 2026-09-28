import { useState } from 'react'
import informationIcon from '../../assets/icons/information.png'
import prices from '../../mocks/prices.json'
import Modal from './Modal'

function formatPrice(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: prices.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function SitePricing() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="pricing-trigger"
        type="button"
        aria-label="Consultar precios del cine"
        title="Precios del cine"
        onClick={() => setIsOpen(true)}
      >
        <img src={informationIcon} alt="" />
      </button>

      {isOpen && (
        <Modal title="Precios del cine" onClose={() => setIsOpen(false)} className="pricing-modal">
          <div className="pricing-modal-content">
            <p className="pricing-intro">Valores de las entradas según formato y categoría.</p>
            <div className="pricing-list">
              {prices.formats.map((format) => (
                <section className="pricing-format" key={format.label}>
                  <h3>{format.label}</h3>
                  <dl>
                    {format.prices.map((price) => (
                      <div key={price.label}>
                        <dt>{price.label}</dt>
                        <dd>{formatPrice(price.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default SitePricing
