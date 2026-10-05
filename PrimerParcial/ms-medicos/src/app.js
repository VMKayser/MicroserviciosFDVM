require("dotenv").config();
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { obtenerMedico, listarMedicos, listarHorariosDisponibles, reservarHorario } = require("./controller/medicoController");
const def = protoLoader.loadSync(path.join(__dirname, "..", "proto", "medicos.proto"), {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});
const pkg = grpc.loadPackageDefinition(def);
const servicio = pkg.clinica.medicos.v1.ServicioMedicos;
const server = new grpc.Server();
server.addService(servicio.service, {
  ObtenerMedico: obtenerMedico,
  ListarMedicos: listarMedicos,
  ListarHorariosDisponibles: listarHorariosDisponibles,
  ReservarHorario: reservarHorario
});

const PORT = process.env.PORT || 50051;
server.bindAsync("0.0.0.0:" + PORT, grpc.ServerCredentials.createInsecure(), (error) => {
  if (error) {
    console.log("Error al iniciar el servidor");
    return;
  }
  console.log("Servidor gRPC corriendo en puerto " + PORT);
});
