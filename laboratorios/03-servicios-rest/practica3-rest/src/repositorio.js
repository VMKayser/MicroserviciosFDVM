const { MongoClient, ObjectId } = require("mongodb");
let col;

async function conectar() {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  col = cliente.db(process.env.MONGO_DB).collection("usuarios");
  await col.createIndex({ correo: 1 }, { unique: true });
  return cliente;
}

const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

module.exports = {
  conectar,
  crear: (u) => col.insertOne(u),
  obtener: (id) => (aId(id) ? col.findOne({ _id: aId(id) }) : null),
  borrar: (id) => col.deleteOne({ _id: aId(id) }),
  porCorreo: (correo) => col.findOne({ correo }),
  todos: () => col.find().toArray(),
  listar: async (filtro, orden, pagina, limite) => {
    const datos = await col
      .find(filtro)
      .sort(orden)
      .skip((pagina - 1) * limite)
      .limit(limite)
      .toArray();
    const total = await col.countDocuments(filtro);
    return { datos, total };
  },
};
