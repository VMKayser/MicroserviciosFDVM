const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const CARPETA = process.env.PROTO_DIR || __dirname + "/../proto";
const definicion = protoLoader.loadSync(CARPETA + "/estudiantes.proto", { keepCase: true });
const paquete = grpc.loadPackageDefinition(definicion).estudiantes;

module.exports = { grpc, paquete, definicion };
