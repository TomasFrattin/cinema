import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Link, useLocation } from 'react-router-dom'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function PurchaseSuccessPage() {
  const location = useLocation()
  const qrContainerRef = useRef(null)
  const purchase = location.state

  if (!purchase) {
    return (
      <main className="purchase-success-page">
        <p className="eyebrow">COMPRA</p>
        <h1>No encontramos la compra</h1>
        <p>Volvé a elegir una función para iniciar una nueva selección.</p>
        <Link className="purchase-primary-link" to="/cartelera">Ver cartelera</Link>
      </main>
    )
  }

  function downloadQr() {
    const canvas = qrContainerRef.current?.querySelector('canvas')
    if (!canvas) return

    const downloadLink = document.createElement('a')
    downloadLink.download = `${purchase.publicReference}.png`
    downloadLink.href = canvas.toDataURL('image/png')
    downloadLink.click()
  }

  return (
    <main className="purchase-success-page">
      <div className="purchase-success-heading">
        <p className="eyebrow">COMPRA SIMULADA</p>
        <h1>¡Compra confirmada!</h1>
        <p>Guardá este código y presentá el QR en el ingreso del cine.</p>
      </div>

      <section className="purchase-success-card" aria-labelledby="purchase-success-title">
        <div className="purchase-success-main">
          <div className="purchase-success-movie">
            <div className="purchase-success-poster-frame">
              {purchase.movie.poster_url ? (
                <img
                  className="purchase-success-poster"
                  src={purchase.movie.poster_url}
                  alt={`Póster de ${purchase.movie.title}`}
                />
              ) : (
                <div className="purchase-success-poster purchase-success-poster-placeholder" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="eyebrow">FUNCIÓN</p>
              <h2 id="purchase-success-title">{purchase.movie.title}</h2>
              <p>{purchase.day} · {purchase.time}</p>
              <p>{purchase.showtime.format} · {purchase.showtime.version}</p>
            </div>
          </div>

          <dl className="purchase-details">
            <div>
              <dt>Referencia</dt>
              <dd>{purchase.publicReference}</dd>
            </div>
            <div>
              <dt>Entradas</dt>
              <dd>{purchase.totalTickets}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatCurrency(purchase.totalAmount)}</dd>
            </div>
          </dl>

          <div className="purchase-ticket-lines">
            {purchase.tickets.map((ticket) => (
              <div key={ticket.label}>
                <span>{ticket.quantity} × {ticket.label}</span>
                <strong>{formatCurrency(ticket.quantity * ticket.amount)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="purchase-qr-panel">
          <p className="eyebrow">CÓDIGO DE ACCESO</p>
          <div className="purchase-qr" ref={qrContainerRef}>
            <QRCodeCanvas
              value={purchase.qrValue}
              size={220}
              bgColor="#f4f3f0"
              fgColor="#1f2021"
              includeMargin
              level="H"
            />
          </div>
          <p>QR de demostración</p>
          <button className="purchase-download" type="button" onClick={downloadQr}>
            Descargar QR
          </button>
        </div>
      </section>

      <div className="purchase-success-actions">
        <Link className="purchase-secondary-link" to="/cartelera">Volver a cartelera</Link>
      </div>
    </main>
  )
}

export default PurchaseSuccessPage