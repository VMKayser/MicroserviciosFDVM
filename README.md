# COM600 · Microservicios

Entregas de la materia. Cada tarea y cada laboratorio en su propia carpeta.

## Estructura

- `tareas/` — una carpeta por tarea
- `laboratorios/` — una carpeta por práctica

Las carpetas van numeradas en orden: `01-tema`, `02-tema`, etc.

## Entregas

| # | Tipo | Entrega | Ruta |
| - | ---- | ------- | ---- |
| 1 | Tarea | CRUD con ORM (TypeORM) | [`tareas/01-crud-typeorm/`](tareas/01-crud-typeorm/) |
| 2 | Tarea | Tres en Raya con WebSockets | [`tareas/02-websockets-tres-en-raya/`](tareas/02-websockets-tres-en-raya/) |
| 1 | Laboratorio | Práctica 1 - MongoDB CRUD | [`laboratorios/01-mongodb-crud/`](laboratorios/01-mongodb-crud/) |

## Correr una entrega

### Tarea 1: CRUD TypeORM
```bash
cd tareas/01-crud-typeorm
npm install
npm run seed
npm run dev
```

### Tarea 2: WebSockets Tres en Raya
```bash
# Servidor WebSocket (ws://localhost:8080)
cd tareas/02-websockets-tres-en-raya/servidor
npm install
npm start

# Cliente Web (http://localhost:3000)
cd tareas/02-websockets-tres-en-raya/cliente
npm install
npm start
```
