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

## PostgreSQL y dominio

- **Decisión:** no configurar todavía PostgreSQL ni modelar el dominio.
- **Motivo:** las reglas reales del cine todavía no fueron relevadas.
- **Consecuencia:** las decisiones de datos, concurrencia, reservas y pagos quedan pendientes de confirmación.