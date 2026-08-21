# Tarea 2: Tres en Raya con WebSockets

Implementación del juego Tres en Raya en tiempo real utilizando WebSockets en Node.js y un cliente web con Express.

## Estructura

- `servidor/`: Servidor WebSocket (`ws`) corriendo en el puerto `8080`.
- `cliente/`: Servidor Express sirviendo la interfaz HTML en el puerto `3000`.

## Ejecución

### 1. Iniciar Servidor WebSocket:
```bash
cd tareas/02-websockets-tres-en-raya/servidor
npm install
npm start
```

### 2. Iniciar Cliente Web:
```bash
cd tareas/02-websockets-tres-en-raya/cliente
npm install
npm start
```

Abrir `http://localhost:3000` en el navegador.
