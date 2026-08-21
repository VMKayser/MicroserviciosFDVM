#!/bin/bash
BASE_DIR="$(dirname "$0")/tareas/02-websockets-tres-en-raya"

echo "Iniciando Servidor WebSocket (ws://localhost:8080)..."
node "$BASE_DIR/servidor/src/server.js" &
SERVER_PID=$!

echo "Iniciando Cliente Express (http://localhost:3000)..."
node "$BASE_DIR/cliente/app.js" &
CLIENT_PID=$!

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" SIGINT SIGTERM

echo "Servidores activos. Abre http://localhost:3000 en tu navegador."
wait
