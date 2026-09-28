import bookingsMock from '../mocks/bookings.json'
import { API_BASE_URL, DATA_SOURCE } from '../config/env'

async function getFromApi(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`)
  }
  return response.json()
}

export async function getBookingsByShowtimeId(showtimeId) {
  if (DATA_SOURCE === 'api') {
    return getFromApi(`/api/showtimes/${showtimeId}/bookings`)
  }
  return bookingsMock.filter((booking) => String(booking.showtime_id) === String(showtimeId))
}

export function getConfirmedTicketCount(bookings) {
  return bookings
    .filter((booking) => booking.status === 'confirmed')
    .reduce((total, booking) => (
      total + booking.tickets.reduce((bookingTotal, ticket) => bookingTotal + ticket.quantity, 0)
    ), 0)
}

export async function getAvailableTickets(showtime) {
  const bookings = await getBookingsByShowtimeId(showtime.id)
  const confirmedTickets = getConfirmedTicketCount(bookings)
  return Math.max(showtime.capacity - confirmedTickets, 0)
}