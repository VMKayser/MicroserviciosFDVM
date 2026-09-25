const amqp = require("amqplib");
const URL = "amqp://admin:admin123@localhost:5672";

async function main() {
  const conexion = await amqp.connect(URL);
  const canal = await conexion.createChannel();

  await canal.assertExchange("inscripciones", "direct", { durable: true });
  await canal.assertExchange("reintentos", "direct", { durable: true });

  // principal: lo que el consumidor rechaza se va al exchange de reintentos
  await canal.assertQueue("notificaciones.correo", {
    durable: true,
    deadLetterExchange: "reintentos",
  });
  await canal.bindQueue("notificaciones.correo", "inscripciones", "inscripcion.confirmada");

  // reintento: retiene 5 segundos y devuelve el mensaje a la cola principal
  await canal.assertQueue("notificaciones.reintento", {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: "inscripciones",
    deadLetterRoutingKey: "inscripcion.confirmada",
  });
  await canal.bindQueue("notificaciones.reintento", "reintentos", "inscripcion.confirmada");

  // muerta: nadie la consume automaticamente, la revisa una persona
  await canal.assertQueue("notificaciones.muertos", { durable: true });

  console.log("Topologia DLQ creada exitosamente");
  await conexion.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
