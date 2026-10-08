const request = require("supertest");
const app = require("../src/app");

test("POST /tareas crea la tarea y responde 201", async () => {
  const res = await request(app).post("/tareas").send({ titulo: "Estudiar" });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
});

test("POST /tareas sin título responde 400 y no crea nada", async () => {
  const res = await request(app).post("/tareas").send({});
  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/titulo/);
});
