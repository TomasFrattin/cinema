import { useEffect, useState } from 'react'
import { getMovies, getShowtimesByMovieId } from '../services/movies.service'
import MovieCard from '../components/movies/MovieCard'
import MovieCarousel from '../components/movies/MovieCarousel'

function getTodayDateKey() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

function hasFutureOrCurrentShowtime(showtimes) {
  return showtimes.some((showtime) => new Date(showtime.starts_at).getTime() >= Date.now())
}

function HomePage() {
  const [homeData, setHomeData] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadHome() {
      const movies = await getMovies()
      const schedules = await Promise.all(
        movies.map(async (movie) => [movie.id, await getShowtimesByMovieId(movie.id)]),
      )

      if (isMounted) {
        setHomeData({
          movies,
          schedulesByMovieId: Object.fromEntries(schedules),
        })
      }
    }

    loadHome()

    return () => {
      isMounted = false
    }
  }, [])

  const movies = homeData?.movies ?? null
  const schedulesByMovieId = homeData?.schedulesByMovieId ?? {}
  const today = getTodayDateKey()
  const activeMovies = movies?.filter((movie) => movie.is_active) ?? []
  const moviesInTheater = activeMovies.filter((movie) => (
    movie.cinema_release_date <= today
    && hasFutureOrCurrentShowtime(schedulesByMovieId[movie.id] ?? [])
  ))
  const upcomingMovies = activeMovies.filter((movie) => movie.cinema_release_date > today)
  const featuredMovies = moviesInTheater.filter((movie) => movie.is_featured).slice(0, 3)

  return (
    <main id="inicio">
      {homeData === null ? (
        <p className="description">Cargando cartelera...</p>
      ) : (
        <>
          <p className="eyebrow">CINEMA / CARTELERA (DATOS DE PRUEBA)</p>
          <h1>Cartelera</h1>

          {featuredMovies.length > 0 && (
            <section>
              <h2>Destacadas</h2>
              <MovieCarousel movies={featuredMovies} />
            </section>
          )}

          {moviesInTheater.length > 0 && (
            <section id="cartelera">
              <h2>En cartelera</h2>
              <div className="movie-grid">
                {moviesInTheater.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showtimes={schedulesByMovieId[movie.id] ?? []}
                  />
                ))}
              </div>
            </section>
          )}

          {upcomingMovies.length > 0 && (
            <section id="proximos-estrenos">
              <h2>Próximos estrenos</h2>
              <div className="movie-grid">
                {upcomingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} showtimes={[]} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default HomePage