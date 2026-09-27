# Decisiones técnicas

## Monorepo con proyectos independientes

- **Decisión:** mantener `frontend/` y `backend/` con su propio `package.json`, coordinados desde la raíz.
- **Motivo:** permite trabajar y desplegar cada aplicación de forma independiente sin perder comandos comunes.
- **Alternativa:** un único proyecto, descartado porque mezclaría responsabilidades demasiado pronto.
- **Consecuencia:** las dependencias se instalan dentro de cada proyecto; la raíz solo coordina desarrollo.

## `concurrently` para desarrollo

- **Decisión:** usar `concurrently` para `npm run dev`.
- **Motivo:** es una solución estándar y pequeña para ejecutar frontend y backend en paralelo.
- **Consecuencia:** no se agregan health checks, process managers ni lógica de detección de procesos.

## PostgreSQL y migraciones SQL

- **Decisión:** utilizar PostgreSQL y migraciones SQL versionadas, sin ORM.
- **Motivo:** el proyecto busca aprender SQL directamente y necesita una estructura reproducible desde una base vacía.
- **Consecuencia:** las migraciones viven en `database/migrations/` y se ejecutan con el runner mínimo de `backend/scripts/migrate.js`.

## Conexión con PostgreSQL

- **Decisión:** utilizar `pg.Pool` y variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.
- **Motivo:** centraliza la configuración, reutiliza conexiones y evita credenciales hardcodeadas.
- **Consecuencia:** la aplicación y el runner de migraciones comparten la configuración de conexión; la base `cinema` se crea manualmente una sola vez.

## Tipos y restricciones de `movies`

- **Decisión:** usar `BIGINT GENERATED ALWAYS AS IDENTITY` para `id`, `TEXT` para contenido textual, `INTEGER` para `duration_minutes`, `DATE` para `release_date` y `TIMESTAMPTZ` para timestamps.
- **Motivo:** son tipos directos y adecuados para los datos definidos, sin imponer catálogos o reglas de negocio todavía no confirmados.
- **Decisión:** `title`, flags y timestamps son `NOT NULL`; `is_featured` tiene default `FALSE`, `is_active` tiene default `TRUE`, y `created_at`/`updated_at` tienen default `NOW()`.
- **Motivo:** una película necesita título y estados/fechas consistentes; los demás campos no deben bloquear datos mientras sus reglas sigan pendientes.
- **Consecuencia:** no se agregan `CHECK` ni índices adicionales sin una necesidad actual documentada. `duration_minutes` es obligatorio porque así se definió para la persistencia inicial.

## Actualización de `movies.updated_at`

- **Decisión:** actualizar `updated_at` mediante un trigger de PostgreSQL antes de cada modificación.
- **Motivo:** el timestamp debe reflejar cambios sin depender de que cada consulta de aplicación lo asigne manualmente.
- **Consecuencia:** la lógica permanece en la base y forma parte de la primera migración.

## Tipos y FK de `showtimes`

- **Decisión:** usar `BIGINT` para `id` y `movie_id`, `TIMESTAMPTZ` para `starts_at` y `TEXT` para `format` y `version`.
- **Motivo:** `format` y `version` todavía no tienen valores definitivos, por lo que no se crean enums ni tablas auxiliares.
- **Decisión:** `movie_id` es `NOT NULL` y referencia `movies.id` con `ON DELETE RESTRICT`.
- **Motivo:** toda función debe pertenecer a una película y eliminar una película no debe borrar silenciosamente sus funciones.
- **Consecuencia:** una película con funciones asociadas no puede eliminarse hasta resolver explícitamente esas funciones. El índice sobre `showtimes.movie_id` facilita consultas por película y acompaña la FK.

## Separación entre `Movie` y `Showtime`

- **Decisión:** representar la película como `Movie` y cada función concreta como `Showtime`.
- **Motivo:** una misma película puede proyectarse en distintos días y con diferentes formatos o versiones.
- **Consecuencia:** `Movie` contiene los datos del contenido; `Showtime` contiene la programación concreta y sus características.

## Relación entre `Movie` y `Showtime`

- **Decisión:** usar una relación conceptual uno a muchos: una `Movie` puede tener cero, una o muchas `Showtime`.
- **Motivo:** una película puede no tener funciones programadas, o tener varias.
- **Consecuencia:** la referencia queda del lado de `Showtime` mediante `movie_id`, con la relación conceptual `Showtime.movie_id -> Movie.id`.

## Atributos de `Movie`

- **Decisión:** considerar inicialmente `id`, `title`, `duration_minutes`, `genre`, `age_rating`, `release_date`, `synopsis`, `poster_url`, `trailer_url`, `is_featured`, `is_active`, `created_at` y `updated_at` como atributos de `Movie`.
- **Motivo:** describen la película como contenido, independientemente de una función concreta.
- **Consecuencia:** `genre` será inicialmente un atributo simple; no se crea `Genre`.

## Atributos de `Showtime`

- **Decisión:** considerar inicialmente `id`, `movie_id`, `starts_at`, `format` y `version` como atributos de `Showtime`.
- **Motivo:** describen una proyección específica.
- **Consecuencia:** `format` representa valores como 2D/3D y `version` representa actualmente conceptos como doblada/subtitulada. El nombre definitivo de `version` y sus valores internos quedan pendientes.

## Películas destacadas y activas

- **Decisión:** usar `is_featured` para la selección editorial del carrusel y `is_active` para el estado de publicación.
- **Motivo:** destacar una película y mantenerla publicada son decisiones diferentes.
- **Consecuencia:** el carrusel de inicio debe filtrar por `is_featured` e `is_active`.

## Sala única

- **Decisión:** no crear `Auditorium` ni agregar `auditorium_id` a `Showtime` en esta etapa.
- **Motivo:** el cine actualmente tiene una única sala y no se necesita representar una elección de sala.
- **Alternativa considerada:** diseñar desde ahora un modelo multi-sala, descartado por introducir complejidad y supuestos fuera del alcance actual.
- **Consecuencia:** las funciones se consideran realizadas en la única sala existente. Si el negocio incorpora más salas, el modelo podrá evolucionar posteriormente.

## Administración de la cartelera

- **Decisión:** `Showtime` será administrable desde un futuro panel de administración, con capacidad esperada para agregar, modificar y eliminar funciones.
- **Motivo:** la cartelera cambia con frecuencia.
- **Consecuencia:** la gestión frecuente queda documentada como comportamiento esperado, pero no se afirma todavía que la planificación sea estrictamente semanal.

## Reglas pendientes

- **Decisión:** marcar como `PENDIENTE` las reglas no confirmadas por el cine.
- **Motivo:** la web actual y la experiencia observada son insumos, no una especificación completa del negocio.
- **Consecuencia:** valores internos, publicación, funciones pasadas o canceladas, reservas, ventas, pagos, usuarios y permisos no se implementan ni se convierten aún en reglas definitivas.