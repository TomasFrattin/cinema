import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Modal from '../components/layout/Modal'
import { getAvailableTickets } from '../services/bookings.service'
import { getMovieById, getShowtimesByMovieId } from '../services/movies.service'

function formatReleaseDate(releaseDate) {
  return new Date(`${releaseDate}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShowtime(showtime) {
  const date = new Date(showtime.starts_at)
  const day = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  return { day, time }
}

function getYoutubeEmbedUrl(trailerUrl) {
  try {
    const url = new URL(trailerUrl)
    const videoId = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop()
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : trailerUrl
  } catch {
    return trailerUrl
  }
}

function MovieDetailPage() {
  const location = useLocation()
  const { movieId } = useParams()
  const [movie, setMovie] = useState(null)
  const [showtimes, setShowtimes] = useState([])
  const [status, setStatus] = useState('loading')
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const returnPath = location.state?.from || '/cartelera'
  const returnLabel = location.state?.fromLabel || 'Volver a cartelera'

  useEffect(() => {
    let isMounted = true

    async function loadMovie() {
      setStatus('loading')
      const movieData = await getMovieById(movieId)

      if (!isMounted) return

      if (!movieData) {
        setStatus('not-found')
        return
      }

      const showtimesData = await getShowtimesByMovieId(movieData.id)
      const now = Date.now()
      const upcomingShowtimes = showtimesData.filter((showtime) => (
        new Date(showtime.starts_at).getTime() >= now
      ))
      const showtimesWithAvailability = await Promise.all(
        upcomingShowtimes.map(async (showtime) => ({
          ...showtime,
          availableTickets: await getAvailableTickets(showtime),
        })),
      )
      if (!isMounted) return

      setMovie(movieData)
      setShowtimes(showtimesWithAvailability)
      setStatus('ready')
    }

    loadMovie().catch(() => {
      if (isMounted) setStatus('error')
    })

    return () => {
      isMounted = false
    }
  }, [movieId])

  if (status === 'loading') {
    return <main className="movie-detail-page"><p>Cargando película...</p></main>
  }

  if (status === 'not-found') {
    return (
      <main className="movie-detail-page">
        <h1>Película no encontrada</h1>
        <Link className="back-link" to={returnPath}>{returnLabel}</Link>
      </main>
    )
  }

  if (status === 'error') {
    return <main className="movie-detail-page"><p>No pudimos cargar la película.</p></main>
  }

  return (
    <main className="movie-detail-page">
      <Link className="back-link" to={returnPath}>{returnLabel}</Link>
      <div className="movie-detail">
        <div className="movie-detail-poster-frame">
          {movie.poster_url ? (
            <img className="movie-detail-poster" src={movie.poster_url} alt={`Póster de ${movie.title}`} />
          ) : (
            <div className="movie-detail-poster movie-poster-placeholder" aria-hidden="true" />
          )}
        </div>
        <section className="movie-detail-content" aria-labelledby="movie-detail-title">
          <p className="eyebrow">DETALLE DE LA PELÍCULA</p>
          <h1 id="movie-detail-title">{movie.title}</h1>
          <p className="movie-meta">{movie.genre} · {movie.duration_minutes} min · {movie.age_rating}</p>
          <dl className="movie-detail-facts">
            <div>
              <dt>Estreno</dt>
              <dd>{formatReleaseDate(movie.release_date)}</dd>
            </div>
            <div>
              <dt>Género</dt>
              <dd>{movie.genre}</dd>
            </div>
            <div>
              <dt>Duración</dt>
              <dd>{movie.duration_minutes} minutos</dd>
            </div>
            <div>
              <dt>Clasificación</dt>
              <dd>{movie.age_rating}</dd>
            </div>
          </dl>
          <p className="movie-detail-synopsis">{movie.synopsis}</p>
          {movie.trailer_url && (
            <section className="movie-trailer-section" aria-labelledby="movie-trailer-title">
              <p className="eyebrow">TRAILER</p>
              <h2 id="movie-trailer-title">Ver adelanto</h2>
              <button className="movie-trailer-link" type="button" onClick={() => setIsTrailerOpen(true)}>
                Ver trailer
              </button>
            </section>
          )}
        </section>
      </div>

      <section className="movie-detail-showtimes" aria-labelledby="showtimes-title">
        <p className="eyebrow">CARTELERA</p>
        <h2 id="showtimes-title">Funciones disponibles</h2>
        {showtimes.length > 0 ? (
          <ul className="showtime-list movie-detail-showtime-list">
            {showtimes.map((showtime) => {
              const { day, time } = formatShowtime(showtime)
              const isSoldOut = showtime.availableTickets === 0

              return (
                <li key={showtime.id}>
                  <Link
                    className={`showtime-option${isSoldOut ? ' showtime-option-sold-out' : ''}`}
                    to={`/funciones/${showtime.id}/entradas`}
                    state={{ from: `/peliculas/${movie.id}`, fromLabel: `Volver a ${movie.title}` }}
                    aria-disabled={isSoldOut}
                    onClick={(event) => {
                      if (isSoldOut) event.preventDefault()
                    }}
                  >
                    <span className="showtime-option-date">{day}</span>
                    <strong className="showtime-option-time">{time}</strong>
                    <span className="showtime-option-format">{showtime.format} · {showtime.version}</span>
                    <span className="showtime-option-availability">
                      {isSoldOut ? 'Función agotada' : `${showtime.availableTickets} entradas disponibles`}
                    </span>
                    <span className="showtime-option-action">{isSoldOut ? 'Agotada' : 'Elegir entradas'}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No hay funciones programadas para esta película.</p>
        )}
      </section>

      {isTrailerOpen && movie.trailer_url && (
        <Modal title={`${movie.title} · Trailer`} onClose={() => setIsTrailerOpen(false)} className="trailer-modal">
          <div className="trailer-player">
            <iframe
              src={getYoutubeEmbedUrl(movie.trailer_url)}
              title={`Trailer de ${movie.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </main>
  )
}

export default MovieDetailPage
