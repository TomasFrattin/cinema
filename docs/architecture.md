# Arquitectura

## Estado actual

El repositorio es un monorepo con dos proyectos independientes:

- `frontend/`: aplicación React ejecutada con Vite.
- `backend/`: servidor Express en JavaScript.

El frontend se ejecuta en el puerto habitual de Vite y el backend escucha en el puerto 3000. Actualmente React consulta directamente `GET http://localhost:3000/api/health`. Express usa `cors` para permitir esa comunicación durante el desarrollo local.

## Componentes futuros

- Base de datos: PENDIENTE. PostgreSQL fue elegido como opción futura, pero todavía no está configurado.
- Integraciones externas: PENDIENTE.
- Autenticación, reservas y tiempo real: PENDIENTE.