import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p className="eyebrow">ERROR 404</p>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe o ya no está disponible.</p>
      <div className="not-found-actions">
        <Link className="purchase-primary-link" to="/">Ir al inicio</Link>
        <Link className="purchase-secondary-link" to="/cartelera">Ver cartelera</Link>
      </div>
    </main>
  )
}

export default NotFoundPage