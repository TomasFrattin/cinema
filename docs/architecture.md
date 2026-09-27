# Arquitectura

## Estado actual

El repositorio es un monorepo con dos proyectos independientes:

- `frontend/`: aplicación React ejecutada con Vite.
- `backend/`: servidor Express en JavaScript.

El frontend se ejecuta en el puerto habitual de Vite y el backend escucha en el puerto 3000. Actualmente React consulta directamente `GET http://localhost:3000/api/health`. Express usa `cors` para permitir esa comunicación durante el desarrollo local.

PostgreSQL es la base de datos del proyecto. La estructura se reproduce mediante migraciones SQL versionadas en `database/migrations/`. No se utiliza ORM ni una herramienta de migraciones pesada.

El backend centraliza la conexión mediante un `Pool` de `pg`. Las credenciales se obtienen de variables de entorno y las migraciones se ejecutan contra la base `cinema` ya creada.

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

- Endpoints para `Movie` y `Showtime`: PENDIENTE.
- Integraciones externas: PENDIENTE.
- Autenticación, reservas y tiempo real: PENDIENTE.