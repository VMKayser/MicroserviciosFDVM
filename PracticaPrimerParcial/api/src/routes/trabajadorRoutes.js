const express = require('express');
const {
  obtenerTrabajadores,
  crearTrabajador,
  editarTrabajador,
  eliminarTrabajador
} = require('../controller/trabajadorController');

const router = express.Router();

router.get('/', obtenerTrabajadores);
router.post('/', crearTrabajador);
router.put('/:id', editarTrabajador);
router.delete('/:id', eliminarTrabajador);

module.exports = router;


