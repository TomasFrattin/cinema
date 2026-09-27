CREATE TABLE showtimes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  movie_id BIGINT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  format TEXT,
  version TEXT,
  CONSTRAINT showtimes_movie_id_fkey
    FOREIGN KEY (movie_id)
    REFERENCES movies (id)
    ON DELETE RESTRICT
);

CREATE INDEX showtimes_movie_id_idx ON showtimes (movie_id);