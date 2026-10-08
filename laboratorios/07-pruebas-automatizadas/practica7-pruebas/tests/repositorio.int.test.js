const { MongoDBContainer } = require("@testcontainers/mongodb");
const { crearRepositorio } = require("../src/repositorio");

let contenedor, repo;

beforeAll(async () => {
  contenedor = await new MongoDBContainer("mongo:7").start();
  repo = await crearRepositorio(
    contenedor.getConnectionString() + "?directConnection=true"
  );
}, 120000);

afterAll(async () => {
  if (repo) await repo.cerrar();
  if (contenedor) await contenedor.stop();
});

test("guarda una tarea y la recupera por título", async () => {
  await repo.guardar({ titulo: "Leer Newman", completada: false });
  const encontrada = await repo.buscarPorTitulo("Leer Newman");
  expect(encontrada.completada).toBe(false);
});
