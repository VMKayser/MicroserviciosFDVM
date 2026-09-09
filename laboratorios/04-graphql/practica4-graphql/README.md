# Práctica N.º 4 — GraphQL y el patrón Backend for Frontend (BFF)

**Asignatura:** COM-600 · Microservicios  
**Universidad:** Universidad Mayor Real y Pontificia de San Francisco Xavier de Chuquisaca  
**Estudiante:** Freddy Daniel Valencia Medina  
**Gestión:** 2/2026  

---

## 📋 Descripción del Proyecto

Implementación de una capa GraphQL que actúa como contrato público tipado y como agregador **Backend for Frontend (BFF)** sobre dos orígenes de datos:
1. Base de datos relacional **MySQL 8** (ventas y detalle de venta).
2. Microservicio **REST** (usuarios y clientes en el puerto 3000).

Incluye optimización contra el problema de consulta **N+1** utilizando `DataLoader`, control de errores formateados, mitigación de consultas profundas con `graphql-depth-limit` y desactivación de introspección en producción.

---

## 🚀 Instrucciones para Levantar los Servicios

Para levantar la solución completa, ejecute los servicios en el siguiente orden:

### 1. Levantar la Base de Datos (MySQL 8)
El contenedor Docker corre en el puerto `3306`:
```bash
docker start mysql-practica4
```
*Si necesita importar o verificar la base de datos:*
```bash
mysql -u root < db/practica4.sql
```

---

### 2. Levantar el Microservicio REST (Práctica 3)
En una terminal separada, levante el servicio que expone `/usuarios` en el puerto `3000`:
```bash
cd laboratorios/03-servicios-rest/practica3-rest
node src/server.js
```
*Comprobar que está arriba:*
```bash
curl http://localhost:3000/usuarios
```

---

### 3. Levantar el Servidor GraphQL (Apollo Server)
En otra terminal, dentro de esta carpeta (`practica4-graphql`):
```bash
cd laboratorios/04-graphql/practica4-graphql
npm install
node src/servidor.js
```
El servidor quedará escuchando en:
👉 **http://localhost:4000/**

---

## 📁 Estructura del Código

```text
practica4-graphql/
├── db/
│   └── practica4.sql        # Script SQL de creación de tablas y datos de prueba
├── package.json             # Dependencias (Apollo Server, GraphQL, MySQL2, DataLoader, etc.)
├── README.md                # Este documento de instrucciones
└── src/
    ├── cargadores.js        # DataLoader por petición para resolver el problema N+1
    ├── db.js                # Conexión MySQL pool con contador y logging de consultas SQL
    ├── esquema.js           # Esquema GraphQL (typeDefs con Query, Mutation, Input y tipos)
    ├── resolvers.js         # Resolvers con acceso a MySQL y composición BFF vía HTTP
    └── servidor.js          # Configuración de Apollo Server, formatError y depthLimit
```

---

## 🔍 Consultas de Prueba (Apollo Sandbox)

### Consulta Compuesta BFF (Venta + Detalle + Cliente vía REST):
```graphql
query {
  venta(id: 1) {
    fecha
    total
    cliente {
      nombre
      email
    }
    detalle {
      producto
      cantidad
      precioUnitario
    }
  }
}
```

### Mutación de Creación de Venta:
```graphql
mutation {
  crearVenta(input: {
    clienteId: 2
    fecha: "2026-08-20"
    detalle: [
      { producto: "Impresora", cantidad: 1, precioUnitario: 620.00 }
      { producto: "Cartucho", cantidad: 3, precioUnitario: 85.50 }
    ]
  }) {
    id
    total
    detalle { producto cantidad }
  }
}
```
