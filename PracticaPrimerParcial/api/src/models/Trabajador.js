    const mongoose = require('mongoose');

    const trabajadorSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      apellido: { type: String, required: true },
      cedulaIdentidad: { type: String, required: true, unique: true },
      cargo: { type: String, required: true },
      departamento: { type: String, required: true },
      fechaIngreso: { type: Date, default: Date.now }
    }, { timestamps: true });

    module.exports = mongoose.model('Trabajador', trabajadorSchema);