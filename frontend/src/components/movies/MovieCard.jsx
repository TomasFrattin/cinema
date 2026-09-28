import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getShowtimesByMovieId } from '../../services/movies.service'

function MovieCard({ movie, showtimes: providedShowtimes }) {
  const location = useLocation()
  const [showtimes, setShowtimes] = useState(null)
  const [posterFailed, setPosterFailed] = useState(false)

  useEffect(() => {
    if (providedShowtimes !== undefined) return undefined

    let isMounted = true
    getShowtimesByMovieId(movie.id).then((data) => {
      if (isMounted) setShowtimes(data)
    })
    return () => {
      isMounted = false
    }
  }, [movie.id, providedShowtimes])

  const showPoster = movie.poster_url && !posterFailed
  const visibleShowtimes = providedShowtimes ?? showtimes
  const availableFormats = [...new Set(
    (visibleShowtimes ?? []).map((showtime) => showtime.format).filter(Boolean),
  )].sort()
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  const returnLabel = location.pathname === '/' ? 'Volver al inicio' : 'Volver a cartelera'

  return (
    <article className="movie-card">
      <Link
        className="movie-card-link"
        to={`/peliculas/${movie.id}`}
        state={{ from: returnPath, fromLabel: returnLabel }}
      >
        <div className="movie-poster-frame">
          {showPoster ? (
            <img
              className="movie-poster"
              src={movie.poster_url}
              alt={`Póster de ${movie.title}`}
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <div className="movie-poster movie-poster-placeholder" aria-hidden="true" />
          )}
          <div className="movie-card-badges">
            <div className="movie-format-badges" aria-label="Formatos disponibles">
              {availableFormats.map((format) => <span className="movie-card-badge" key={format}>{format}</span>)}
            </div>
            <span className="movie-card-badge movie-duration-badge">{movie.duration_minutes} min</span>
          </div>
        </div>
        <div className="movie-card-body">
          <h3>{movie.title}</h3>
          <p className="movie-meta">{movie.genre} · {movie.age_rating}</p>
        </div>
      </Link>
    </article>
  )
}

export default MovieCard