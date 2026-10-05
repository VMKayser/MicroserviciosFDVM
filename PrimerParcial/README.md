# Primer Parcial - Microservicios (COM-600)

Este directorio contiene la solución del **Primer Parcial** de la materia de Microservicios (COM-600), estructurada bajo una arquitectura de microservicios con Docker y Docker Compose.

---

## 🏗️ Arquitectura del Sistema

El sistema gestiona una clínica médica a través de servicios independientes con sus respectivas bases de datos:

| Servicio | Tipo / Protocolo | Puerto | Base de Datos | Tecnologías |
| :--- | :--- | :--- | :--- | :--- |
| **`ms-pacientes`** | REST API (HTTP/JSON) | `3001` | MySQL 8.0 (`clinica`) | Node.js, Express, `mysql2` |
| **`ms-medicos`** | gRPC (Protocol Buffers) | `50051` | PostgreSQL 16.2 (`clinica_medicos`) | Node.js, `@grpc/grpc-js`, `@grpc/proto-loader`, `pg` |
| **`db-citas`** | Base de Datos NoSQL | `27017` | MongoDB 7.0 (`clinica_citas`) | MongoDB |

---

## 📁 Estructura del Proyecto

```text
PrimerParcial/
├── docker-compose.yml          # Orquestación de servicios y bases de datos
├── .env                        # Variables de entorno
├── .env.example                # Plantilla de variables de entorno
├── cosasolvidehacer.md         # Comandos de prueba curl y grpcurl
├── README.md                   # Documentación del parcial
├── ms-pacientes/               # Microservicio REST de Pacientes (MySQL)
│   ├── Dockerfile
│   ├── init.sql                # Script de creación de tabla y datos semilla
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── database.js
│       ├── controller/pacienteController.js
│       └── routes/pacienteRoutes.js
├── ms-medicos/                 # Microservicio gRPC de Médicos (PostgreSQL)
│   ├── Dockerfile
│   ├── init.sql                # Script de creación de esquemas y datos semilla
│   ├── package.json
│   ├── proto/
│   │   └── medicos.proto       # Definición de servicios y mensajes protobuf
│   └── src/
│       ├── app.js
│       ├── database.js
│       └── controller/medicoController.js
└── ms-citas/                   # Espacio reservado para microservicio citas (MongoDB)
    └── init-mongo.js
```

---

## 🚀 Despliegue con Docker Compose

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Construir y levantar contenedores:**
   ```bash
   docker compose up --build -d
   ```

3. **Verificar el estado de los servicios:**
   ```bash
   docker compose ps
   ```

4. **Detener los servicios:**
   ```bash
   docker compose down
   ```

---

## 🧪 Pruebas de Funcionamiento

### 1. Microservicio Pacientes (`ms-pacientes` - REST)

- **Health check:**
  ```bash
  curl http://localhost:3001/api/v1/salud
  ```

- **Listar pacientes paginados:**
  ```bash
  curl "http://localhost:3001/api/v1/pacientes?pagina=1&tam=2"
  ```

- **Obtener paciente por ID:**
  ```bash
  curl http://localhost:3001/api/v1/pacientes/1
  ```

- **Crear un nuevo paciente:**
  ```bash
  curl -X POST http://localhost:3001/api/v1/pacientes \
    -H "Content-Type: application/json" \
    -d '{
      "ci": "9988776",
      "nombre": "Carlos",
      "apellido": "Mamani",
      "fecha_nacimiento": "1995-05-15",
      "telefono": "71234567",
      "seguro": "SI"
    }'
  ```

---

### 2. Microservicio Médicos (`ms-medicos` - gRPC)

Pruebas mediante `grpcurl`:

- **Listar médicos:**
  ```bash
  grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ListarMedicos
  ```

- **Obtener médico por ID:**
  ```bash
  grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 1}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ObtenerMedico
  ```

- **Listar horarios disponibles de un médico (Streaming del servidor):**
  ```bash
  grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 1}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ListarHorariosDisponibles
  ```

- **Reservar horario:**
  ```bash
  grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 2}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ReservarHorario
  ```
