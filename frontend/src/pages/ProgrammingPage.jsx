import { useEffect, useState } from 'react'
import MovieCard from '../components/movies/MovieCard'
import { getMovies, getShowtimesByMovieId } from '../services/movies.service'

function getDateKey(startsAt) {
  return startsAt.slice(0, 10)
}

function getAvailableDates(schedules) {
  return [...new Set(
    schedules.flatMap(({ showtimes }) => showtimes.map(({ starts_at }) => getDateKey(starts_at))),
  )].sort()
}

function formatDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ProgrammingPage() {
  const [schedules, setSchedules] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadSchedules() {
      try {
        const movies = await getMovies()
        const activeMovies = movies.filter((movie) => movie.is_active)
        const schedulesByMovie = await Promise.all(
          activeMovies.map(async (movie) => ({
            movie,
            showtimes: await getShowtimesByMovieId(movie.id),
          })),
        )

        if (!isMounted) return

        setSchedules(schedulesByMovie)
        setSelectedDate(getAvailableDates(schedulesByMovie)[0] ?? '')
      } catch {
        if (isMounted) setHasError(true)
      }
    }

    loadSchedules()

    return () => {
      isMounted = false
    }
  }, [])

  const availableDates = schedules ? getAvailableDates(schedules) : []
  const moviesForDate = schedules?.map(({ movie, showtimes }) => ({
    movie,
    showtimes: showtimes.filter((showtime) => getDateKey(showtime.starts_at) === selectedDate),
  })).filter(({ showtimes }) => showtimes.length > 0) ?? []

  return (
    <main className="programming-page">
      <p className="eyebrow">CARTELERA / PROGRAMACIÓN</p>
      <h1>Funciones</h1>
      <p className="programming-intro">
        Elegí una fecha para consultar las películas y horarios disponibles.
      </p>

      <div className="date-filter">
        <label htmlFor="programming-date">Fecha</label>
        <input
          id="programming-date"
          type="date"
          value={selectedDate}
          min={availableDates[0]}
          max={availableDates[availableDates.length - 1]}
          onChange={(event) => setSelectedDate(event.target.value)}
          disabled={schedules === null || availableDates.length === 0}
        />
        {selectedDate && <span>{formatDate(selectedDate)}</span>}
      </div>

      {schedules === null && !hasError && <p className="programming-status">Cargando programación...</p>}
      {hasError && <p className="programming-status">No pudimos cargar la programación.</p>}
      {schedules !== null && !hasError && moviesForDate.length === 0 && (
        <p className="programming-status">No hay funciones programadas para esta fecha.</p>
      )}
      {moviesForDate.length > 0 && (
        <div className="movie-grid programming-grid">
          {moviesForDate.map(({ movie, showtimes }) => (
            <MovieCard key={movie.id} movie={movie} showtimes={showtimes} />
          ))}
        </div>
      )}
    </main>
  )
}

export default ProgrammingPage
