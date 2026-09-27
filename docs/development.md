# Desarrollo local

## Requisitos

- Node.js y npm instalados.
- PostgreSQL instalado y accesible.
- La base `cinema` creada manualmente una sola vez.

## Instalación

Desde la raíz del repositorio:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

Copiar `backend/.env.example` como `backend/.env` y completar las variables de PostgreSQL. En este entorno ya existe un `backend/.env` local. No versionar `backend/.env` ni incluir credenciales reales en Git.

Variables utilizadas:

- `DB_HOST`: servidor PostgreSQL.
- `DB_PORT`: puerto PostgreSQL, normalmente `5432`.
- `DB_NAME`: base del proyecto, `cinema`.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: contraseña del usuario.

## Comandos

- `npm run dev`: levanta frontend y backend simultáneamente.
- `npm run dev:front`: levanta solo Vite.
- `npm run dev:back`: levanta solo Express.
- `npm --prefix backend run migrate`: ejecuta las migraciones pendientes en orden sobre `cinema`.
- `npm --prefix frontend run build`: genera el build del frontend.
- `npm --prefix frontend run lint`: ejecuta Oxlint.

## Verificación

1. Ejecutar `npm run migrate` desde `backend/`.
2. Consultar `schema_migrations` y verificar que contiene las versiones aplicadas.
3. Verificar que existen `movies` y `showtimes` y que `showtimes.movie_id` referencia `movies.id`.

La base `cinema` no es creada por el runner: debe existir previamente y solo se crea manualmente una vez.

## Migraciones

Las migraciones se ejecutan en este orden:

1. `001_create_movies.sql`: crea `movies`, el trigger de `updated_at` y sus restricciones básicas.
2. `002_create_showtimes.sql`: crea `showtimes`, la FK hacia `movies` y el índice de `movie_id`.

El runner registra las migraciones aplicadas en `schema_migrations` y no vuelve a ejecutar una versión ya registrada. Ejecutar nuevamente `npm run migrate` no duplica ni reaplica migraciones.

Todavía no existen endpoints de `Movie` o `Showtime`, ni datos seed ficticios.