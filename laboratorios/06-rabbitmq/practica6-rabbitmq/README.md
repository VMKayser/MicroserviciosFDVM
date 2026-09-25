# Práctica N.º 6 — Mensajería Asíncrona con RabbitMQ

**Asignatura:** COM-600 · Microservicios  
**Universidad:** Universidad Mayor Real y Pontificia de San Francisco Xavier de Chuquisaca  
**Facultad:** Facultad de Ciencia y Tecnología  
**Estudiante:** Freddy Daniel Valencia Medina  
**Gestión:** 2/2026  

---

## 📋 Descripción del Proyecto

Implementación de una arquitectura de comunicación asíncrona basada en eventos utilizando **RabbitMQ** como message broker bajo el protocolo **AMQP 0-9-1**.

El sistema demuestra:
1. **Desacoplamiento temporal y espacial**: El microservicio productor emite eventos de dominio y continúa su ejecución sin bloquearse ni esperar la disponibilidad o respuesta de los consumidores.
2. **Topología de mensajería (Exchanges, Queues y Bindings)**:
   - Exchange directo (`direct`) para entrega punto a punto hacia colas específicas.
   - Exchange temático (`topic`) con enrutamiento jerárquico mediante patrones y comodines (`*` y `#`).
3. **Garantías de entrega y persistencia**:
   - Confirmación manual (`noAck: false`, `canal.ack(mensaje)`) con `prefetch(1)`.
   - Mensajes persistentes (`persistent: true`) almacenados en disco.
   - Colas durables (`durable: true`) resistentes a caídas y reinicios del broker.
4. **Circuito de reintentos acotados y Dead Letter Queue (DLQ)**:
   - Desvío de mensajes rechazados hacia un exchange de reintentos.
   - Cola de espera intermedia con tiempo de vida (TTL de 5 segundos).
   - Conteo de intentos mediante encabezados `x-death` y límite máximo de 3 fallos antes de apartar el mensaje defectuoso a la cola de mensajes muertos (`notificaciones.muertos`).
5. **Idempotencia en el consumidor**:
   - Identificador de evento estable (`messageId`) originado en el dominio del hecho (`id` de inscripción).
   - Control de duplicados en el consumidor para evitar daños colaterales (como el doble descuento de cupos).

---

## 📁 Estructura del Proyecto

```text
practica6-rabbitmq/
├── docker-compose.yml          # Despliegue de RabbitMQ 3.13 con interfaz de gestión web
├── package.json                # Dependencias raíz (amqplib) para scripts de topología
├── README.md                   # Documentación completa y guía de arranque
├── topologia.js                # Script de topología para exchange temático (topic)
├── dlq.js                      # Script de configuración del circuito DLQ y reintentos
├── cuerpo.json                 # Carga útil de prueba para peticiones HTTP
├── inscripciones/              # Microservicio Productor (Express + AMQP)
│   ├── .env.example            # Plantilla de variables de entorno
│   ├── package.json            # Dependencias (express, amqplib, dotenv)
│   ├── cola.js                 # Conexión al broker y publicación con messageId y persistencia
│   └── index.js                # API REST con endpoints /inscripciones
└── notificaciones/             # Microservicio Consumidor (Worker AMQP)
    ├── .env.example            # Plantilla de variables de entorno
    ├── package.json            # Dependencias (amqplib, dotenv)
    └── index.js                # Consumidor con control x-death, DLQ e idempotencia
```

---

## 🚀 Guía de Puesta en Marcha

### 1. Iniciar el Message Broker RabbitMQ

En la raíz del proyecto (`practica6-rabbitmq`):

```bash
docker compose up -d
```

Verifique que el contenedor `com600-rabbit` esté en estado saludable y con el arranque completo:
```bash
docker compose ps
docker compose logs rabbitmq | tail -8
```

- **Consola de Administración Web:** [http://localhost:15672](http://localhost:15672)  
- **Usuario:** `admin`  
- **Contraseña:** `admin123`  
- **Puerto AMQP:** `5672`

---

### 2. Declarar la Topología de Mensajería y Circuitos DLQ

Instale las dependencias de los scripts de inicialización y ejecútelos:

```bash
npm install
node topologia.js
node dlq.js
```

Esto creará automáticamente en RabbitMQ:
* **Exchanges:** `inscripciones` (direct), `eventos.academicos` (topic), `reintentos` (direct).
* **Colas:** `notificaciones.correo`, `notificaciones.reintento` (TTL: 5000 ms), `notificaciones.muertos`, `correo.bienvenida`, `finanzas.cobros`, `auditoria.todo`.

---

### 3. Iniciar el Microservicio Productor (`inscripciones`)

```bash
cd inscripciones
npm install
cp .env.example .env
node index.js
```
El productor se conectará al broker en `amqp://localhost:5672` y expondrá su API REST en el puerto `3000`.

---

### 4. Iniciar el Microservicio Consumidor (`notificaciones`)

En otra terminal:

```bash
cd notificaciones
npm install
cp .env.example .env
node index.js
```
El consumidor iniciará escuchando la cola `notificaciones.correo` con confirmación manual, control de reintentos y deduplicación por idempotencia.

---

### 5. Pruebas Funcionales con `curl`

#### Publicar una inscripción exitosa:
```bash
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Freddy Valencia","correo":"freddy@usfx.bo","curso":"COM-600"}'
```

#### Simular ráfaga con consumidor apagado (demostración de desacoplamiento):
Detenga el consumidor con `Ctrl + C` y ejecute 5 peticiones:
```bash
for i in {1..5}; do curl -s -X POST -H "Content-Type: application/json" -d '{"estudiante":"Alumno","correo":"a@usfx.bo","curso":"COM-600"}' http://localhost:3000/inscripciones > /dev/null && echo "enviada $i"; done
```
*Observe en la consola web cómo la cola acumula 5 mensajes en `Ready`. Al volver a iniciar el consumidor (`node index.js`), los mensajes son procesados en orden y la cola vuelve a cero.*

#### Probar reintentos y cola de mensajes muertos (mensaje envenenado):
Envíe un registro con formato de correo inválido (sin arroba):
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"estudiante":"Prueba Fallo","correo":"correo-sin-arroba","curso":"COM-600"}' \
  http://localhost:3000/inscripciones
```
*El consumidor fallará 3 veces con intervalos de 5 segundos gracias a la cola de reintento. Tras agotar los 3 intentos, el mensaje será depositado en la cola `notificaciones.muertos` sin bloquear al consumidor ni saturar la cola principal.*

---

## 📝 Respuestas a las Preguntas de Comprobación

### Pregunta N.º 1 (Lab 0)
Ganamos desacoplamiento y velocidad: el emisor publica su evento en milisegundos y sigue trabajando sin bloquearse ni esperar a que el receptor responda, permitiendo que la cola retenga los mensajes si el consumidor se cae. El problema nuevo es que añadimos un intermediario que se vuelve un punto único de falla (si RabbitMQ se cae, se corta la comunicación) y nos obliga a gestionar la consistencia eventual y monitorear otro servidor más.

### Pregunta N.º 2 (Lab 1)
En el productor no hay que modificar absolutamente nada de código. Como el productor solo publica en el exchange sin importarle quién lo escucha, la integración se resuelve al 100% en el broker: solo creamos una nueva cola para finanzas y la enlazamos al mismo exchange con la misma clave de enrutamiento, y RabbitMQ se encargará de duplicar el mensaje a ambas colas.

### Pregunta N.º 3 (Lab 2)
Inscripciones se liberó del tiempo de espera y del riesgo de fallar por culpa de un servidor de correos externo o lento. A cambio, le está haciendo al estudiante una promesa de consistencia eventual: su inscripción ya es un hecho confirmado y oficial en el sistema, y su correo de bienvenida le llegará en breve de forma garantizada en segundo plano.

### Pregunta N.º 4 (Lab 3)
El trabajo pendiente está resguardado en la cola `notificaciones.correo` dentro de RabbitMQ, consumiendo memoria RAM y almacenamiento en disco duro del broker. Si el consumidor nunca volviera, la cola acumularía mensajes indefinidamente hasta agotar los recursos del servidor, provocando que RabbitMQ active sus alarmas de disco/memoria y bloquee a los productores para que no sigan aceptando operaciones.

### Pregunta N.º 5 (Lab 4)
Llegó únicamente a `auditoria.todo` porque su enlace usa `#` (que acepta cualquier clave), mientras que las otras dos colas exigían empezar estrictamente con `inscripcion` o `pago`. La diferencia es que `*` reemplaza solo una palabra entre puntos (por ejemplo `alumno.*.registrado` acepta `alumno.becado.registrado`, pero no `alumno.becado.extranjero.registrado`), mientras que `#` cubre cero, una o muchas palabras (como `alumno.#`, que atrapa cualquier evento del módulo sin importar cuántas palabras tenga).

### Pregunta N.º 6 (Lab 5)
Si la cola es durable pero el mensaje no es persistente, al reiniciar el broker la cola se salva pero reaparece completamente vacía; y si el mensaje es persistente pero la cola es transitoria, la cola se destruye al reinicio y el mensaje se borra con ella. La durabilidad cuesta rendimiento porque obliga a escribir constantemente en disco (`I/O`), lo cual reduce drásticamente la velocidad y no conviene pagarlo en datos efímeros o de descarte rápido como métricas de telemetría o ubicaciones de GPS.

### Pregunta N.º 7 (Lab 6)
Sería un grave error reintentarlo en automático porque si el mensaje llegó a la cola muerta es porque falló tres veces por un error real y repetitivo (como un correo mal escrito o un JSON corrupto), por lo que reintentar solo crearía un bucle infinito que saturaría el sistema. Quien atienda esa cola debe: (1) abrir el mensaje e inspeccionar la causa del fallo, (2) arreglar el error en la base de datos o en el código del servicio, (3) reinyectar el mensaje corregido al exchange original y (4) limpiar el mensaje defectuoso de la cola muerta.

### Pregunta N.º 8 (Lab 7)
El broker no puede garantizar "exactamente una vez" porque si el consumidor procesa el trabajo pero la red se corta antes de que el `ack` llegue de vuelta, el broker asume una caída y le reenvía el mensaje a otro, dejando la responsabilidad de evitar duplicados 100% en el consumidor mediante idempotencia. En mi proyecto, si el evento `PagoMatricula` se recibiera dos veces por un fallo de red y el consumidor no fuera idempotente, se le debitaría dos veces el dinero de la tarjeta al estudiante o se emitirían dos facturas por una sola matrícula.
