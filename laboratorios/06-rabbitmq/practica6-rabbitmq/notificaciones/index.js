require("dotenv").config();
const amqp = require("amqplib");
const COLA = process.env.COLA;
const LIMITE = 3;

const cupos = { "COM-600": 30 };
function descontarCupo(evento) {
  cupos[evento.curso] = (cupos[evento.curso] ?? 30) - 1;
  console.log("[cupos]", evento.curso, "quedan", cupos[evento.curso]);
}

function procesar(evento) {
  if (!evento.correo || !evento.correo.includes("@")) {
    throw new Error("correo invalido: " + evento.correo);
  }
  console.log("[correo] bienvenida enviada a", evento.correo, "por", evento.id);
  descontarCupo(evento);
}

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();
  await canal.assertQueue(COLA, {
    durable: true,
    deadLetterExchange: "reintentos",
  });
  canal.prefetch(1);
  console.log("[correo] esperando mensajes en", COLA);

  const procesados = new Set();

  canal.consume(
    COLA,
    (mensaje) => {
      if (mensaje === null) return;
      const muertes = mensaje.properties.headers["x-death"];
      const intentos = muertes ? muertes[0].count : 0;
      if (intentos >= LIMITE) {
        console.error("[correo] sin mas intentos: a la cola muerta");
        canal.sendToQueue("notificaciones.muertos", mensaje.content, {
          persistent: true,
        });
        return canal.ack(mensaje);
      }
      const evento = JSON.parse(mensaje.content.toString());
      const id = mensaje.properties.messageId || evento.id;
      if (procesados.has(id)) {
        console.log("[idempotencia] evento repetido", id, "- se ignora");
        return canal.ack(mensaje); // confirmar igual: ya esta hecho
      }
      try {
        procesar(evento);
        procesados.add(id);
        canal.ack(mensaje);
      } catch (e) {
        console.error("[correo] intento", intentos + 1, "fallido:", e.message);
        canal.nack(mensaje, false, false); // false: no reencolar aqui
      }
    },
    { noAck: false }
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
