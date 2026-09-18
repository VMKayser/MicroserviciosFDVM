const Trabajador = require('../models/Trabajador');

// GET /trabajador -> Obtener todos los trabajadores
const obtenerTrabajadores = async (req, res) => {
  try {
    const trabajadores = await Trabajador.find();
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /trabajador -> Crear un nuevo trabajador
const crearTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, cedulaIdentidad, cargo, departamento, fechaIngreso } = req.body;
    const nuevoTrabajador = await Trabajador.create({
      nombre,
      apellido,
      cedulaIdentidad,
      cargo,
      departamento,
      fechaIngreso
    });
    res.status(201).json(nuevoTrabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /trabajador/:id -> Actualizar la información de un trabajador
const editarTrabajador = async (req, res) => {
  try {
    const trabajador = await Trabajador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trabajador) {
      return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    }
    res.json(trabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /trabajador/:id -> Eliminar un trabajador
const eliminarTrabajador = async (req, res) => {
  try {
    const resultado = await Trabajador.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    }
    res.json({ mensaje: 'Trabajador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerTrabajadores,
  crearTrabajador,
  editarTrabajador,
  eliminarTrabajador,
};