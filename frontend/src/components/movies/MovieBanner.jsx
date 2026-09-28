function MovieBanner({ movie }) {
  return (
    <article className="movie-banner" style={{ '--banner-image': `url("${movie.banner_url}")` }}>
      <img className="movie-banner-image" src={movie.banner_url} alt={`Banner de ${movie.title}`} />
      <div className="movie-banner-content">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.genre} · {movie.duration_minutes} min · {movie.age_rating}
        </p>
        <p className="movie-synopsis">{movie.synopsis}</p>
      </div>
    </article>
  )
}

export default MovieBanner