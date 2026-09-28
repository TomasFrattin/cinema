import { useEffect, useRef, useState } from 'react'
import carouselArrow from '../../assets/icons/carousel-arrow.png'
import MovieBanner from './MovieBanner'

const AUTO_SCROLL_DELAY = 5000

function MovieCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const isAnimatingRef = useRef(false)
  const autoScrollTimerRef = useRef(null)
  const loopedMovies = [movies[movies.length - 1], ...movies, movies[0]]

  function moveCarousel(direction) {
    if (isAnimatingRef.current) return

    isAnimatingRef.current = true
    setTransitionEnabled(true)
    setCurrentIndex((index) => index + direction)
  }

  function clearAutoScrollTimer() {
    if (autoScrollTimerRef.current !== null) {
      window.clearTimeout(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }
  }

  function scheduleAutoScroll() {
    clearAutoScrollTimer()
    autoScrollTimerRef.current = window.setTimeout(() => {
      moveCarousel(1)
      scheduleAutoScroll()
    }, AUTO_SCROLL_DELAY)
  }

  function handleInteraction() {
    scheduleAutoScroll()
  }

  function handleKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    handleInteraction()
    moveCarousel(event.key === 'ArrowLeft' ? -1 : 1)
  }

  useEffect(() => {
    scheduleAutoScroll()

    return clearAutoScrollTimer
  }, [movies.length])

  function handleTransitionEnd(event) {
    if (event.propertyName !== 'transform') return

    if (currentIndex === 0) {
      setTransitionEnabled(false)
      setCurrentIndex(movies.length)
    }

    if (currentIndex === movies.length + 1) {
      setTransitionEnabled(false)
      setCurrentIndex(1)
    }

    isAnimatingRef.current = false
  }

  return (
    <div
      className="movie-carousel"
      onKeyDown={handleKeyDown}
      onPointerDown={handleInteraction}
      onPointerMove={handleInteraction}
    >
      <div
        className={`movie-carousel-track${transitionEnabled ? '' : ' movie-carousel-track-no-transition'}`}
        role="region"
        aria-label="Películas destacadas"
        tabIndex="0"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
        onFocus={handleInteraction}
      >
        {loopedMovies.map((movie, index) => (
          <div className="movie-carousel-slide" key={`${movie.id}-${index}`}>
            <MovieBanner movie={movie} />
          </div>
        ))}
      </div>
      <div className="carousel-controls" aria-label="Controles del carrusel">
        <button
          className="carousel-button"
          type="button"
          aria-label="Película destacada anterior"
          onClick={() => {
            handleInteraction()
            moveCarousel(-1)
          }}
        >
          <img className="carousel-arrow carousel-arrow-previous" src={carouselArrow} alt="" />
        </button>
        <button
          className="carousel-button"
          type="button"
          aria-label="Siguiente película destacada"
          onClick={() => {
            handleInteraction()
            moveCarousel(1)
          }}
        >
          <img className="carousel-arrow carousel-arrow-next" src={carouselArrow} alt="" />
        </button>
      </div>
    </div>
  )
}

export default MovieCarousel