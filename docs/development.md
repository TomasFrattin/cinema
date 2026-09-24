# Desarrollo local

## Requisitos

- Node.js y npm instalados.
- No se requiere una base de datos para esta etapa.

## Instalación

Desde la raíz del repositorio:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

No hay variables de entorno necesarias actualmente.

## Comandos

- `npm run dev`: levanta frontend y backend simultáneamente.
- `npm run dev:front`: levanta solo Vite.
- `npm run dev:back`: levanta solo Express con Nodemon.
- `npm --prefix frontend run build`: genera el build del frontend.
- `npm --prefix frontend run lint`: ejecuta Oxlint.

## Verificación

1. Ejecutar `npm run dev` desde la raíz.
2. Abrir `http://localhost:5173`.
3. Comprobar que la pantalla muestra `API health: ok`.
4. También se puede consultar `http://localhost:3000/api/health` directamente.