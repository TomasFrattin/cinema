import { Link } from 'react-router-dom'

function CandyShopPage() {
  return (
    <main className="candy-shop-page">
      <section className="candy-shop-panel" aria-labelledby="candy-shop-title">
        <div className="candy-shop-mark" aria-hidden="true">CS</div>
        <div className="candy-shop-content">
          <p className="eyebrow">CANDY SHOP · WIP</p>
          <h1 id="candy-shop-title">Algo rico para acompañar la función</h1>
          <p>
            Estamos preparando una nueva forma de reservar combos, bebidas y golosinas antes de venir al cine.
          </p>
          <Link className="candy-shop-link" to="/">Volver al inicio</Link>
        </div>
      </section>
    </main>
  )
}

export default CandyShopPage