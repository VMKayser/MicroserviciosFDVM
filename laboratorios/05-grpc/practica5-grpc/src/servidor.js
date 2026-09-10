const { grpc, paquete } = require("./carga");

const estudiantes = new Map([
  ["9876543", { ci: "9876543", nombres: "Ana", apellidos: "Torres", correo: "ana@correo.com", carrera_actual: "Sistemas" }]
]);

const servicio = {
  AgregarEstudiante: (llamada, responder) => {
    const e = llamada.request;
    if (!e.ci) {
      return responder({
        code: grpc.status.INVALID_ARGUMENT,
        message: "El campo ci es obligatorio"
      });
    }
    estudiantes.set(e.ci, e);
    responder(null, { estudiante: e });
  },
  ObtenerEstudiante: (llamada, responder) => {
    const e = estudiantes.get(llamada.request.ci);
    if (!e) {
      return responder({
        code: grpc.status.NOT_FOUND,
        message: "Estudiante no encontrado"
      });
    }
    responder(null, { estudiante: e });
  },
  ListarEstudiantes: (llamada) => {
    const carrera = llamada.request.carrera;
    let enviados = 0;
    for (const e of estudiantes.values()) {
      if (carrera && e.carrera !== carrera) continue;
      llamada.write(e);
      enviados++;
    }
    console.log("Enviados", enviados, "estudiantes por el flujo");
    llamada.end();
  },
};

const servidor = new grpc.Server();
servidor.addService(paquete.EstudianteService.service, servicio);

const DIR = process.env.GRPC_ADDR || "0.0.0.0:50051";
servidor.bindAsync(DIR, grpc.ServerCredentials.createInsecure(), (err, puerto) => {
  if (err) return console.error("No se pudo abrir el puerto:", err);
  console.log("Servicio gRPC escuchando en el puerto", puerto);
});
