const { MongoClient } = require("mongodb");

async function crearRepositorio(uri) {
  const cliente = await new MongoClient(uri).connect();
  const col = cliente.db("practica7").collection("tareas");
  return {
    guardar: (t) => col.insertOne(t),
    buscarPorTitulo: (titulo) => col.findOne({ titulo }),
    contar: () => col.countDocuments(),
    cerrar: () => cliente.close(),
  };
}

module.exports = { crearRepositorio };
