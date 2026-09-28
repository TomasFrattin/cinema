import { useEffect, useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import pricesMock from '../mocks/prices.json'
import { getAvailableTickets } from '../services/bookings.service'
import { getMovieById, getShowtimeById } from '../services/movies.service'

function formatShowtimeDate(startsAt) {
  const date = new Date(startsAt)
  return {
    day: date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
    time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: pricesMock.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function TicketSelectionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { showtimeId } = useParams()
  const purchaseId = useId()
  const [movie, setMovie] = useState(null)
  const [showtime, setShowtime] = useState(null)
  const [availableTickets, setAvailableTickets] = useState(0)
  const [quantities, setQuantities] = useState({})
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isMounted = true

    async function loadSelection() {
      setStatus('loading')
      const showtimeData = await getShowtimeById(showtimeId)

      if (!isMounted) return

      if (!showtimeData) {
        setStatus('not-found')
        return
      }

      const [movieData, available] = await Promise.all([
        getMovieById(showtimeData.movie_id),
        getAvailableTickets(showtimeData),
      ])

      if (!isMounted) return

      if (!movieData) {
        setStatus('not-found')
        return
      }

      setMovie(movieData)
      setShowtime(showtimeData)
      setAvailableTickets(available)
      setStatus('ready')
    }

    loadSelection().catch(() => {
      if (isMounted) setStatus('error')
    })

    return () => {
      isMounted = false
    }
  }, [showtimeId])

  if (status === 'loading') {
    return <main className="ticket-page"><p>Cargando función...</p></main>
  }

  if (status === 'not-found') {
    return (
      <main className="ticket-page">
        <h1>Función no encontrada</h1>
        <Link className="back-link" to="/cartelera">Volver a cartelera</Link>
      </main>
    )
  }

  if (status === 'error') {
    return <main className="ticket-page"><p>No pudimos cargar la función.</p></main>
  }

  const { day, time } = formatShowtimeDate(showtime.starts_at)
  const ticketOptions = pricesMock.formats.find(({ label }) => label === showtime.format)?.prices ?? []
  const selectedTickets = ticketOptions.map((ticket) => ({
    ...ticket,
    quantity: quantities[ticket.label] ?? 0,
  }))
  const totalTickets = selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0)
  const totalAmount = selectedTickets.reduce((total, ticket) => total + ticket.quantity * ticket.amount, 0)
  const returnPath = location.state?.from || `/peliculas/${movie.id}`
  const returnLabel = location.state?.fromLabel || `Volver a ${movie.title}`

  function updateQuantity(label, delta) {
    setQuantities((currentQuantities) => {
      const currentQuantity = currentQuantities[label] ?? 0
      const nextQuantity = Math.max(currentQuantity + delta, 0)
      const nextTotal = totalTickets - currentQuantity + nextQuantity

      if (nextTotal > availableTickets) return currentQuantities

      return { ...currentQuantities, [label]: nextQuantity }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (totalTickets === 0) return

    const publicReference = `CINE-${String(showtime.id).padStart(2, '0')}-${purchaseId.replaceAll(':', '').slice(-6).toUpperCase()}`
    navigate('/compra/procesando', {
      state: {
        purchase: {
          movie,
          showtime,
          day,
          time,
          tickets: selectedTickets.filter(({ quantity }) => quantity > 0),
          totalTickets,
          totalAmount,
          publicReference,
          qrValue: `https://cine.local/validar/${publicReference}`,
        },
      },
    })
  }

  return (
    <main className="ticket-page">
      <Link className="back-link" to={returnPath}>{returnLabel}</Link>
      <div className="ticket-page-heading">
        <h1>Elegí tus entradas</h1>
      </div>

      <div className="ticket-layout">
        <section className="ticket-selection" aria-labelledby="ticket-selection-title">
          <div className="ticket-movie-summary">
            <div className="ticket-poster-frame">
              {movie.poster_url ? (
                <img className="ticket-poster" src={movie.poster_url} alt={`Póster de ${movie.title}`} />
              ) : (
                <div className="ticket-poster ticket-poster-placeholder" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="eyebrow">PELÍCULA</p>
              <h2>{movie.title}</h2>
              <p className="movie-meta">{movie.genre} · {movie.duration_minutes} min · {movie.age_rating}</p>
            </div>
          </div>

          <div className="ticket-showtime-summary">
            <div>
              <span className="ticket-summary-label">Función</span>
              <strong>{day}</strong>
            </div>
            <div>
              <span className="ticket-summary-label">Horario</span>
              <strong>{time}</strong>
            </div>
            <div>
              <span className="ticket-summary-label">Formato</span>
              <strong>{showtime.format} · {showtime.version}</strong>
            </div>
          </div>

          <div className="ticket-availability">
            <span>Entradas disponibles</span>
            <strong>{availableTickets}</strong>
          </div>

          <form className="ticket-form" onSubmit={handleSubmit}>
            <div>
              <p className="eyebrow">CATEGORÍAS</p>
              <h2 id="ticket-selection-title">¿Cuántas entradas necesitás?</h2>
            </div>
            <div className="ticket-option-list">
              {ticketOptions.map((ticket) => {
                const quantity = quantities[ticket.label] ?? 0
                const isPlusDisabled = totalTickets >= availableTickets

                return (
                  <div className="ticket-option" key={ticket.label}>
                    <div>
                      <strong>{ticket.label}</strong>
                      <span>{formatCurrency(ticket.amount)} por entrada</span>
                    </div>
                    <div className="ticket-stepper" aria-label={`Cantidad de entradas ${ticket.label}`}>
                      <button type="button" onClick={() => updateQuantity(ticket.label, -1)} disabled={quantity === 0} aria-label={`Quitar entrada ${ticket.label}`}>−</button>
                      <output>{quantity}</output>
                      <button type="button" onClick={() => updateQuantity(ticket.label, 1)} disabled={isPlusDisabled} aria-label={`Agregar entrada ${ticket.label}`}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="ticket-submit" type="submit" disabled={totalTickets === 0 || availableTickets === 0}>
              Confirmar compra
            </button>
          </form>
        </section>

        <aside className="ticket-order-summary" aria-labelledby="ticket-summary-title">
          <p className="eyebrow">RESUMEN</p>
          <h2 id="ticket-summary-title">Tu selección</h2>
          <div className="ticket-summary-movie">
            <strong>{movie.title}</strong>
            <span>{day} · {time}</span>
          </div>
          <div className="ticket-summary-lines">
            {selectedTickets.filter(({ quantity }) => quantity > 0).map((ticket) => (
              <div key={ticket.label}>
                <span>{ticket.quantity} × {ticket.label}</span>
                <strong>{formatCurrency(ticket.quantity * ticket.amount)}</strong>
              </div>
            ))}
            {totalTickets === 0 && <p>Elegí al menos una entrada para continuar.</p>}
          </div>
          <div className="ticket-total">
            <span>Total</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default TicketSelectionPage