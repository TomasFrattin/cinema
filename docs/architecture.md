# Arquitectura

## Estado actual

El repositorio es un monorepo con dos proyectos independientes:

- `frontend/`: aplicación React ejecutada con Vite.
- `backend/`: servidor Express en JavaScript.

El frontend se ejecuta en el puerto habitual de Vite y el backend escucha en el puerto 3000.

PostgreSQL es la base de datos del proyecto. La estructura se reproduce mediante migraciones SQL versionadas en `database/migrations/`. No se utiliza ORM ni una herramienta de migraciones pesada. El backend centraliza la conexión mediante un `Pool` de `pg`, con credenciales por variables de entorno.

## MVP frontend-only con datos mockeados

Para validar el MVP con el cliente rápidamente, el frontend por ahora no consume el backend. Los datos de `Movie` y `Showtime` viven en JSON estáticos dentro de `frontend/src/mocks/` (`movies.json`, `showtimes.json`), con la misma forma de atributos documentada en este archivo.

Toda la UI accede a los datos a través de `frontend/src/services/movies.service.js`, que expone `getMovies()` y `getShowtimesByMovieId(movieId)`. Estas funciones son la única puerta de entrada a los datos: los componentes no importan los JSON directamente ni conocen el origen real.

El origen de datos se controla con la variable `VITE_DATA_SOURCE` (`mock` o `api`) definida en `frontend/.env`. Con `api`, el mismo servicio llama a `VITE_API_BASE_URL` (por ejemplo `GET /api/movies`) en lugar de leer los JSON. Migrar del mock a la API real consiste en cambiar esta variable y en implementar los endpoints correspondientes en el backend; no requiere modificar los componentes de React.

El backend y las migraciones de PostgreSQL siguen existiendo y funcionando de forma independiente, pero el frontend no depende de ellos mientras dure esta etapa de MVP.

## Imágenes (pósters y banners)

Las imágenes se guardan en `frontend/public/images/`, no en `frontend/src/assets/`, porque se referencian de forma dinámica mediante un string (`poster_url`), igual que lo hará la API más adelante. Todo lo que está en `public/` se sirve tal cual, sin pasar por el bundler.

- `frontend/public/images/movies/`: pósters de películas. El campo `poster_url` del mock (y luego de la API) apunta a `/images/movies/<archivo>`.
- `frontend/public/images/banners/`: banners generales del sitio (por ejemplo, un hero de inicio), todavía sin uso en la UI.

`frontend/src/assets/` queda reservado para gráficos fijos de la interfaz que se importan directamente en el código (no aplica a contenido variable como pósters).

## Modelo conceptual inicial

El dominio inicial separa el contenido de una película de cada función concreta:

### `Movie`

Representa la película como contenido publicado por el cine. Sus atributos iniciales son:

- `id`
- `title`
- `duration_minutes`
- `genre`
- `age_rating`
- `release_date`
- `synopsis`
- `poster_url`
- `trailer_url`
- `is_featured`
- `is_active`
- `created_at`
- `updated_at`

`genre` es inicialmente un atributo simple. No se crea una entidad `Genre`.

`is_featured` indica si el administrador quiere destacar la película en el carrusel de inicio. `is_active` indica si está publicada y activa en el sitio. El carrusel debe considerar películas que cumplan ambas condiciones.

### `Showtime`

Representa una función concreta de una película. Sus atributos iniciales son:

- `id`
- `movie_id`
- `starts_at`
- `format`
- `version`

La relación conceptual es de uno a muchos: una `Movie` puede tener cero, una o muchas `Showtime`. La referencia pertenece a `Showtime`: `Showtime.movie_id -> Movie.id`.

`format` y `version` pertenecen a `Showtime`, no a `Movie`, porque una misma película puede proyectarse en distintos días con características diferentes, por ejemplo 2D o 3D, y doblada o subtitulada.

## Sala

El cine tiene actualmente una única sala. En esta etapa no se modela una entidad `Auditorium` ni se agrega `auditorium_id` a `Showtime`; las funciones se consideran realizadas en la única sala existente.

Si el negocio incorporara múltiples salas, el modelo podría evolucionar para agregar `Auditorium`, pero esa evolución está fuera del alcance actual.

## Administración de funciones

`Showtime` representa la programación concreta y será administrable desde un futuro panel de administración. Se espera que la cartelera pueda agregarse, modificarse y eliminarse con frecuencia.

La gestión semanal se considera una observación o comportamiento esperado, no una regla definitiva: todavía debe confirmarse cómo trabaja internamente el cine.

## Componentes aún no incorporados

- Endpoints para `Movie` y `Showtime`: PENDIENTE. El frontend ya está preparado para consumirlos vía `VITE_DATA_SOURCE=api` cuando existan.
- Integraciones externas: PENDIENTE.
- Autenticación, reservas y tiempo real: PENDIENTE.