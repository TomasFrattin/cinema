# Reglas de negocio

Este documento distingue entre información observada en la web actual o en la experiencia del cine, decisiones de diseño tomadas para esta etapa y reglas que todavía necesitan confirmación.

## Observaciones y requisitos iniciales

- La web muestra información de películas como título, duración, género, clasificación por edad, formato, fecha de estreno, funciones, sinopsis, fotos y trailers.
- Una misma película puede proyectarse en distintos días con diferentes características de función.
- Actualmente el cine tiene una única sala.
- La cartelera cambia con frecuencia y se espera que las funciones sean administrables.

Estas observaciones son el punto de partida del modelo, pero no convierten automáticamente todos los comportamientos observados en reglas de negocio definitivas.

## Decisiones de dominio adoptadas

### Películas y funciones

- `Movie` representa la película como contenido.
- `Showtime` representa una función concreta.
- Una película puede tener cero, una o muchas funciones.
- La relación es uno a muchos y la referencia conceptual está en `Showtime.movie_id`.
- `format` pertenece a `Showtime` porque una película puede proyectarse en 2D o 3D según la función.
- `version` pertenece a `Showtime` porque una función puede ser doblada o subtitulada independientemente de otra función de la misma película.

### Destacadas y activas

- `is_featured` indica que el administrador quiere destacar una película en el carrusel de inicio.
- `is_active` indica que la película está publicada/activa en el sitio.
- El carrusel debe mostrar películas que estén activas y destacadas.

### Sala y programación

- El cine se modela actualmente con una única sala.
- Las funciones se consideran realizadas en esa sala.
- No se establece una regla de planificación estrictamente semanal.
- La programación debe poder ser administrada en el futuro panel, incluyendo agregar, modificar y eliminar funciones.

## Pendientes de confirmar con el cine

- PENDIENTE: valores válidos y significado exacto de `age_rating`.
- PENDIENTE: valores permitidos para `format`.
- PENDIENTE: nombre definitivo de `version` y sus valores internos.
- PENDIENTE: cómo se gestiona realmente la cartelera y con qué frecuencia.
- PENDIENTE: qué ocurre con funciones pasadas, canceladas o modificadas.
- PENDIENTE: reglas de publicación, archivado y desactivación de películas.
- PENDIENTE: catálogo, salas y distribución de asientos si el negocio cambia.
- PENDIENTE: reservas, ventas, pagos, cancelaciones, usuarios y permisos.