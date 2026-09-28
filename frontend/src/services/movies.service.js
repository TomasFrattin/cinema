import moviesMock from '../mocks/movies.json'
import showtimesMock from '../mocks/showtimes.json'
import { API_BASE_URL, DATA_SOURCE } from '../config/env'

// Los componentes solo usan estas funciones: cambiar DATA_SOURCE a 'api'
// migra el origen de datos sin tocar la UI.
async function getFromApi(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`)
  }
  return response.json()
}

export async function getMovies() {
  if (DATA_SOURCE === 'api') {
    return getFromApi('/api/movies')
  }
  return moviesMock
}

export async function getMovieById(movieId) {
  const movies = await getMovies()
  return movies.find((movie) => (
    String(movie.id) === String(movieId) && movie.is_active
  )) ?? null
}

export async function getShowtimesByMovieId(movieId) {
  if (DATA_SOURCE === 'api') {
    return getFromApi(`/api/movies/${movieId}/showtimes`)
  }
  return showtimesMock.filter((showtime) => showtime.movie_id === movieId)
}

export async function getShowtimeById(showtimeId) {
  if (DATA_SOURCE === 'api') {
    return getFromApi(`/api/showtimes/${showtimeId}`)
  }
  return showtimesMock.find((showtime) => String(showtime.id) === String(showtimeId)) ?? null
}
