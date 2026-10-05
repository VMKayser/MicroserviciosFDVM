const express = require("express");
const { obtenerPacientes, obtenerPaciente, crearPaciente, editarPaciente, parchePaciente, eliminarPaciente } = require("../controller/pacienteController");

const router = express.Router();

router.get("/", obtenerPacientes);
router.get("/:id", obtenerPaciente);
router.post("/", crearPaciente);
router.put("/:id", editarPaciente);
router.patch("/:id", parchePaciente);
router.delete("/:id", eliminarPaciente);

module.exports = router;
