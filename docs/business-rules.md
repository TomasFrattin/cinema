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
- `is_active` indica que la película está publicada y habilitada para aparecer en el sitio.
- `is_active` no indica que una película esté actualmente en cartelera.
- `release_date` conserva la fecha de estreno original de la película.
- `cinema_release_date` indica la fecha en la que el cine habilita la película para su público.
- El carrusel debe mostrar películas que estén activas, estrenadas en el cine y destacadas.

### Clasificación de la Home

- Una película activa está **En Cartelera** cuando `cinema_release_date` ya llegó y tiene al menos un showtime futuro o vigente.
- Una película activa está en **Próximos Estrenos** cuando `cinema_release_date` es posterior al día actual.
- La fecha de estreno tiene prioridad sobre los showtimes: una función cargada antes de `cinema_release_date` no mueve la película a En Cartelera ni genera solapamiento.
- Una película con fecha de estreno ya cumplida y sin showtimes futuros o vigentes no aparece en ninguna de esas dos secciones.
- Un showtime pasado no cuenta para determinar si una película está En Cartelera.

### Uso de `is_active`

- El administrador debe desactivar `is_active` cuando quiera retirar una película de la publicación pública, por ejemplo por una decisión editorial, un problema de contenido, derechos o un retiro definitivo.
- El administrador no debe desactivar automáticamente una película solo porque se hayan terminado sus funciones; podría volver a programarse más adelante.
- Cuando `is_active` es `false`, la película no debe aparecer en Home, Próximos Estrenos ni Programación pública.
- Las funciones pasadas no deberían eliminarse automáticamente; pueden conservarse para historial y auditoría.

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
- PENDIENTE: si se necesita un estado editorial más detallado que `is_active`, por ejemplo borrador, publicada, archivada o retirada.
- PENDIENTE: catálogo, salas y distribución de asientos si el negocio cambia.
- PENDIENTE: reservas, ventas, pagos, cancelaciones, usuarios y permisos.