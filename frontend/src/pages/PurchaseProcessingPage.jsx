import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function PurchaseProcessingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const purchase = location.state?.purchase

  useEffect(() => {
    if (!purchase) return undefined

    const timeoutId = window.setTimeout(() => {
      navigate('/compra/exito', { replace: true, state: purchase })
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [navigate, purchase])

  if (!purchase) {
    return (
      <main className="purchase-processing-page">
        <p className="eyebrow">COMPRA</p>
        <h1>Operación no disponible</h1>
        <p>Volvé a elegir una función para iniciar una nueva selección.</p>
        <Link className="purchase-primary-link" to="/cartelera">Ver cartelera</Link>
      </main>
    )
  }

  return (
    <main className="purchase-processing-page" aria-live="polite">
      <section className="purchase-processing-panel" aria-labelledby="purchase-processing-title">
        <span className="purchase-spinner" aria-hidden="true" />
        <p className="eyebrow">COMPRA SIMULADA</p>
        <h1 id="purchase-processing-title">Procesando tu compra</h1>
        <p>Estamos simulando la validación del pago para {purchase.movie.title}.</p>
        <span className="purchase-processing-hint">En producción, aquí se conectaría Mercado Pago u otro medio de pago.</span>
      </section>
    </main>
  )
}

export default PurchaseProcessingPage