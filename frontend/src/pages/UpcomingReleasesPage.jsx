import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMovies } from '../services/movies.service'

function getTodayDateKey() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

function getReleaseDateParts(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`)

  return {
    day: date.toLocaleDateString('es-AR', { day: '2-digit' }),
    month: date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
    full: date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }
}

function MovieReleaseLink({ movie, className, children }) {
  return (
    <Link
      className={className}
      to={`/peliculas/${movie.id}`}
      state={{ from: '/proximos-estrenos', fromLabel: 'Volver a próximos estrenos' }}
    >
      {children}
    </Link>
  )
}

function UpcomingReleasesPage() {
  const [movies, setMovies] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMovies() {
      try {
        const moviesData = await getMovies()

        if (isMounted) setMovies(moviesData)
      } catch {
        if (isMounted) setHasError(true)
      }
    }

    loadMovies()

    return () => {
      isMounted = false
    }
  }, [])

  const today = getTodayDateKey()
  const upcomingMovies = movies
    ?.filter((movie) => movie.is_active && movie.cinema_release_date > today)
    .sort((firstMovie, secondMovie) => firstMovie.cinema_release_date.localeCompare(secondMovie.cinema_release_date)) ?? []
  const [featuredMovie, ...otherMovies] = upcomingMovies

  return (
    <main className="upcoming-page">
      <header className="upcoming-page-header">
        <p className="eyebrow">CINEMA / LO QUE VIENE</p>
        <h1>Próximos estrenos</h1>
        <p className="upcoming-page-intro">
          Historias que llegan pronto a nuestra sala. Elegí una película para conocerla mejor antes de su estreno.
        </p>
      </header>

      {movies === null && !hasError && <p className="programming-status">Cargando próximos estrenos...</p>}
      {hasError && <p className="programming-status">No pudimos cargar los próximos estrenos.</p>}
      {movies !== null && !hasError && upcomingMovies.length === 0 && (
        <p className="programming-status">Todavía no hay próximos estrenos anunciados.</p>
      )}

      {featuredMovie && (
        <>
          <section className="upcoming-feature" aria-labelledby="upcoming-feature-title">
            <div
              className="upcoming-feature-art"
              style={{
                '--upcoming-feature-image': (featuredMovie.poster_url || featuredMovie.banner_url)
                  ? `url("${featuredMovie.poster_url || featuredMovie.banner_url}")`
                  : 'none',
              }}
              aria-hidden="true"
            >
              <span className="upcoming-feature-kicker">PRÓXIMO ESTRENO</span>
              <strong>{getReleaseDateParts(featuredMovie.cinema_release_date).day}</strong>
              <span>{getReleaseDateParts(featuredMovie.cinema_release_date).month}</span>
              <small>{new Date(`${featuredMovie.cinema_release_date}T12:00:00`).getFullYear()}</small>
            </div>
            <div className="upcoming-feature-content">
              <p className="eyebrow">EL PRÓXIMO CAPÍTULO</p>
              <h2 id="upcoming-feature-title">{featuredMovie.title}</h2>
              <p className="upcoming-meta">
                {featuredMovie.genre} · {featuredMovie.duration_minutes} min · {featuredMovie.age_rating}
              </p>
              <p className="upcoming-synopsis">{featuredMovie.synopsis}</p>
              <dl className="upcoming-facts">
                <div>
                  <dt>Estreno en sala</dt>
                  <dd>{getReleaseDateParts(featuredMovie.cinema_release_date).full}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>Próximamente</dd>
                </div>
              </dl>
              <MovieReleaseLink className="upcoming-primary-link" movie={featuredMovie}>
                Ver detalle
              </MovieReleaseLink>
            </div>
          </section>

          {otherMovies.length > 0 && (
            <section className="upcoming-more" aria-labelledby="upcoming-more-title">
              <div className="upcoming-section-heading">
                <div>
                  <p className="eyebrow">AGENDA DE ESTRENOS</p>
                  <h2 id="upcoming-more-title">También en camino</h2>
                </div>
                <span>{otherMovies.length} {otherMovies.length === 1 ? 'película' : 'películas'}</span>
              </div>
              <div className="upcoming-release-list">
                {otherMovies.map((movie) => {
                  const releaseDate = getReleaseDateParts(movie.cinema_release_date)

                  return (
                    <article className="upcoming-release" key={movie.id}>
                      <div className="upcoming-release-date" aria-label={`Estreno ${releaseDate.full}`}>
                        <strong>{releaseDate.day}</strong>
                        <span>{releaseDate.month}</span>
                      </div>
                      <div className="upcoming-release-content">
                        <p className="eyebrow">PRÓXIMAMENTE · {releaseDate.full}</p>
                        <h3>{movie.title}</h3>
                        <p className="upcoming-meta">
                          {movie.genre} · {movie.duration_minutes} min · {movie.age_rating}
                        </p>
                        <p>{movie.synopsis}</p>
                      </div>
                      <MovieReleaseLink className="upcoming-secondary-link" movie={movie}>
                        Ver detalle
                      </MovieReleaseLink>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default UpcomingReleasesPage