const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const RUTA = __dirname + "/../proto/estudiantes.proto";
const def = protoLoader.loadSync(RUTA, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).estudiantes;
const DIR = process.env.GRPC_ADDR || "localhost:50051";
const cliente = new paquete.EstudianteService(DIR, grpc.credentials.createInsecure());

function obtenerEstudiante(ci) {
  return new Promise((ok, mal) => {
    cliente.ObtenerEstudiante({ ci }, (err, res) =>
      err ? mal(err) : ok(res.estudiante)
    );
  });
}

module.exports = { obtenerEstudiante };
