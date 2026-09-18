# Práctica Primer Parcial — Microservicios (COM-600)

Implementación de una arquitectura de microservicio que gestiona el recurso **Trabajador** exponiendo dos interfaces de comunicación:
1. **API RESTful** con Express y MongoDB.
2. **API GraphQL** con Apollo Server, Express y MongoDB.
3. Despliegue orquestado con **Docker Compose** en una red interna.

---

## 📋 Modelo de Datos (Trabajador)

Cada trabajador contiene los siguientes campos:
* `nombre` (String, Obligatorio)
* `apellido` (String, Obligatorio)
* `cedulaIdentidad` (String, Obligatorio, Único)
* `cargo` (String, Obligatorio)
* `departamento` (String, Obligatorio)
* `fechaIngreso` (Date / String)

---

## 🚀 Despliegue con Docker Compose

Para levantar la base de datos MongoDB y el servicio Node.js en una misma red:

```bash
docker compose up --build
```

* **API REST:** `http://localhost:3000/trabajador`
* **API GraphQL:** `http://localhost:3000/graphql`
* **Healthcheck:** `http://localhost:3000/salud`

---

## 📡 1. Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/trabajador` | Obtener todos los trabajadores |
| `POST` | `/trabajador` | Crear un nuevo trabajador |
| `PUT` | `/trabajador/:id` | Actualizar la información de un trabajador |
| `DELETE` | `/trabajador/:id` | Eliminar un trabajador |

### Ejemplo POST (`/trabajador`):
```json
{
  "nombre": "Freddy Daniel",
  "apellido": "Valencia Medina",
  "cedulaIdentidad": "1049283-CH",
  "cargo": "Ingeniero de Software",
  "departamento": "Sistemas",
  "fechaIngreso": "2026-03-01"
}
```

---

## 🔮 2. Interfaz GraphQL (`/graphql`)

Endpoint POST: `http://localhost:3000/graphql`

### Queries (Consultas):

#### Obtener todos los trabajadores:
```graphql
query {
  obtenerTrabajadores {
    id
    nombre
    apellido
    cedulaIdentidad
    cargo
    departamento
    fechaIngreso
  }
}
```

#### Obtener un trabajador por ID:
```graphql
query {
  obtenerTrabajador(id: "6738df89a1b2c3d4e5f60718") {
    id
    nombre
    cargo
    departamento
  }
}
```

### Mutations (Mutaciones):

#### Crear trabajador:
```graphql
mutation {
  crearTrabajador(input: {
    nombre: "Ana",
    apellido: "Pérez",
    cedulaIdentidad: "9876543-LP",
    cargo: "Arquitecta Cloud",
    departamento: "Infraestructura"
  }) {
    id
    nombre
    cargo
  }
}
```

#### Actualizar trabajador:
```graphql
mutation {
  actualizarTrabajador(
    id: "6738df89a1b2c3d4e5f60718",
    input: { cargo: "Líder de Microservicios" }
  ) {
    id
    nombre
    cargo
  }
}
```

#### Eliminar trabajador:
```graphql
mutation {
  eliminarTrabajador(id: "6738df89a1b2c3d4e5f60718")
}
```
