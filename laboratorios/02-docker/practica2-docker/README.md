# Práctica 2 - Docker Compose (API Node.js + MongoDB + Mongo Express)

Este proyecto orquesta un stack completo de microservicios usando Docker Compose.

## 🚀 Requisitos
- Docker y Docker Compose v2+

## ⚙️ Configuración
1. Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

## ▶️ Levantar el Stack
```bash
docker compose up -d --build
```

## 🛑 Detener el Stack
```bash
docker compose down
```

## 📌 Endpoints disponibles
- **API Node.js**: `http://localhost:3000/`
- **Health check**: `http://localhost:3000/salud`
- **CRUD Tareas**: `http://localhost:3000/tareas`
- **Mongo Express UI**: `http://localhost:8081/`
