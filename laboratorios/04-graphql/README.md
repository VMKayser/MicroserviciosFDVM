# Práctica N.º 4 — GraphQL y el patrón Backend for Frontend
**Asignatura:** COM-600 · Microservicios  
**Universidad:** Universidad Mayor Real y Pontificia de San Francisco Xavier de Chuquisaca  
**Docente:** Lic. Carlos Montellano B.  

---

## 📁 Estructura del Directorio

```text
laboratorios/04-graphql/
├── README.md                 # Descripción y guía del laboratorio
├── capturas_evidencias/      # Capturas de pantalla para la Hoja de Evidencias (19 capturas)
├── informe/                  # Documento final y Hoja de Evidencias en PDF
└── practica4-graphql/        # Carpeta de trabajo de la práctica (código, Apollo Server, MySQL)
    ├── db/
    │   └── practica4.sql     # Script de creación de tablas y datos iniciales
    ├── package.json
    └── src/
        ├── db.js             # Pool de conexiones MySQL con contador SQL
        ├── esquema.js        # Esquema GraphQL (typeDefs)
        ├── resolvers.js      # Resolvers (Query, Mutación, Relaciones y BFF)
        ├── cargadores.js     # DataLoader para mitigar N+1
        └── servidor.js       # Servidor Apollo Server
```

---

## 🚀 Instrucciones para Levantar los Servicios

### 1. Base de Datos (MySQL 8 en Docker)
El contenedor ya se encuentra configurado y corriendo:
```bash
# Para verificar estado o iniciarlo si está apagado:
docker start mysql-practica4

# Para entrar a la consola MySQL:
mysql -u root
```

### 2. Servicio REST de la Práctica 3 (Puerto 3000)
Debe permanecer en ejecución en una terminal independiente:
```bash
cd laboratorios/03-servicios-rest/practica3-rest
node src/server.js
```

### 3. Capa GraphQL (Puerto 4000)
En otra terminal, dentro de la carpeta de trabajo:
```bash
cd laboratorios/04-graphql/practica4-graphql
node src/servidor.js
```
