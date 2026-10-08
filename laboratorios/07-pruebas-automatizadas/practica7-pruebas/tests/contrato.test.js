const contrato = require("../contratos/tarea-creada.contrato.json");
const { construirEventoTareaCreada } = require("../src/eventos");

test("el evento publicado cumple el contrato acordado", () => {
  const evento = construirEventoTareaCreada({ id: 1, titulo: "Estudiar" });
  for (const campo of contrato.camposObligatorios) {
    expect(evento).toHaveProperty(campo);
    expect(typeof evento[campo]).toBe(contrato.tipos[campo]);
  }
});
