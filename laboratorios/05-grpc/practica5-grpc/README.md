# Práctica N.º 5 — Comunicación de alto rendimiento con gRPC

**Asignatura:** COM-600 · Microservicios  
**Universidad:** Universidad Mayor Real y Pontificia de San Francisco Xavier de Chuquisaca  
**Estudiante:** Freddy Daniel Valencia Medina  
**Gestión:** 2/2026  

---

## 📋 Descripción del Proyecto

Implementación de un microservicio interno de expedientes académicos utilizando **gRPC sobre HTTP/2** con serialización binaria mediante **Protocol Buffers (proto3)**.

El sistema demuestra:
1. **Contrato estricto (`.proto`)**: Definición de mensajes, servicios y asignación inmutable de números de campo.
2. **Llamadas unarias y streaming**: Comunicación directa de petición/respuesta y flujo continuo de datos desde el servidor hacia el cliente.
3. **Manejo de errores por código de estado gRPC**: Mapeo estricto de códigos nativos (`NOT_FOUND`, `INVALID_ARGUMENT`, `UNAVAILABLE`, etc.).
4. **Evolución retrocompatible**: Incorporación de nuevos campos sin romper clientes heredados y mitigación de colisiones numéricas mediante directivas `reserved`.
5. **Arquitectura híbrida contenedorizada**: El servicio REST (Práctica 3) actúa como puerta pública hacia el exterior en el puerto `3000` y consume al servicio gRPC en la red interna de Docker (`estudiantes:50051`) sin exponer este último a la red pública.

---

## 📁 Estructura del Proyecto

```text
practica5-grpc/
├── Dockerfile                  # Empaquetado del servicio gRPC en Alpine Linux
├── docker-compose.yml          # Orquestación de red interna Docker (REST + gRPC)
├── package.json                # Dependencias (@grpc/grpc-js, @grpc/proto-loader)
├── README.md                   # Documentación completa y guía de arranque
├── proto/                      # Contrato Protocol Buffers actual (versión 2)
│   └── estudiantes.proto       # Definición con reserved y campos vigentes
├── proto-v1/                   # Versión congelada 1 para pruebas de compatibilidad
│   └── estudiantes.proto       # Contrato original sin modificaciones
├── informe/
│   └── comparacion.md          # Tabla comparativa de mediciones REST vs GraphQL vs gRPC
└── src/
    ├── bytes.js                # Demostración comparativa de bytes y volcado hexadecimal
    ├── carga.js                # Carga dinámica del contrato según PROTO_DIR
    ├── cliente.js              # Cliente gRPC de prueba
    ├── buscar.js               # Consulta por CI con manejo de códigos de estado
    ├── inspeccionar.js         # Muestra los tipos y rutas HTTP/2 generadas
    ├── listar.js               # Cliente consumidor de flujo (streaming por eventos)
    ├── medir.js                # Script de benchmark estadístico de 10 llamadas
    ├── sembrar.js              # Carga masiva de 500 registros para pruebas
    └── servidor.js             # Implementación del servidor gRPC
```

### ¿Por qué existe la carpeta `proto-v1/`?
Representa la versión inmutable del contrato desplegada previamente en producción. Permite validar que los clientes antiguos siguen consumiendo el servicio sin excepciones tras la evolución del contrato (compatibilidad hacia adelante), ignorando en silencio los campos nuevos sin requerir despliegues simultáneos coordinados.

---

## 🚀 Instrucciones para Levantar los Servicios

### Opción A: Despliegue Completo con Docker Compose (Recomendado)

En la raíz de esta carpeta (`practica5-grpc`), ejecute:

```bash
docker compose up --build -d
```

Verifique los contenedores levantados:
```bash
docker compose ps
```

Pruebe la integración desde su navegador o consola:
- **Consumo REST hacia gRPC interno:**
  ```bash
  curl -i http://localhost:3000/usuarios/1/expediente
  ```
- **Comprobación de aislamiento de red (puerto 50051 cerrado al exterior):**
  ```bash
  curl -i http://localhost:50051
  # La conexión debe ser rechazada o fallar, garantizando la seguridad interna.
  ```

Para apagar los servicios:
```bash
docker compose down
```

---

### Opción B: Ejecución Local en Entorno de Desarrollo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Iniciar el servidor gRPC:**
   ```bash
   node src/servidor.js
   ```
3. **En otra terminal, ejecutar las pruebas:**
   ```bash
   node src/cliente.js
   node src/buscar.js 9876543
   node src/sembrar.js
   node src/listar.js Sistemas
   node src/medir.js
   ```

---

## 🌐 Resolución de Red en Docker

En el archivo `docker-compose.yml`, la variable de entorno `GRPC_ADDR: estudiantes:50051` no hace referencia a una IP fija ni a un host configurado manualmente:
- El motor de Docker crea una red virtual tipo puente (*bridge*) compartida.
- El servidor **DNS interno de Docker** resuelve el nombre de servicio `estudiantes` hacia la dirección IP privada del contenedor correspondiente de manera transparente.

---

## 🛡️ Reglas del Equipo para la Evolución del Contrato `.proto`

1. **Inmutabilidad de identificadores numéricos:** Nunca se debe reasignar ni reutilizar el número de un campo retirado o modificado.
2. **Reserva inmediata de campos obsoletos:** Todo campo o etiqueta descartada debe marcarse explícitamente como `reserved <numero>;` y `reserved "<nombre>";` en el archivo `.proto`.
3. **Revisión en Pull Request:** Todo cambio en la carpeta `proto/` debe ser auditado por el líder técnico antes de mezclar a la rama principal, verificando que la prueba de carga contra clientes heredados mantenga compatibilidad.

---

## 📊 Medición y Comparativa: REST vs GraphQL vs gRPC

| Medida | REST (P3) | GraphQL (P4) | gRPC (P5) |
| :--- | :---: | :---: | :---: |
| **Bytes de la respuesta** | 55 bytes | 88 bytes | 34 bytes |
| **Tiempo promedio observado (ms)** | 1.25 ms | 1.80 ms | 0.45 ms |
| **Viajes de red del cliente** | 1 viaje | 1 viaje | 1 viaje |
| **Formato que viaja** | texto | texto | binario |
| **¿Se puede leer sin el contrato?** | sí | sí | no |
| **¿El navegador lo consume directo?** | sí | sí | no |
| **Público al que sirve mejor** | público | interfaces | servicios |

### Conclusión Técnica
- **gRPC** es la solución óptima para el transporte entre microservicios de backend donde la latencia, el ancho de banda y el rendimiento por CPU son críticos.
- **GraphQL** destaca en capas BFF (*Backend for Frontend*) para alimentar interfaces web y móviles reduciendo viajes de ida y vuelta (*round-trips*).
- **REST** sigue siendo el estándar predilecto para APIs públicas y consumo general sin necesidad de esquemas o clientes binarios especiales.
