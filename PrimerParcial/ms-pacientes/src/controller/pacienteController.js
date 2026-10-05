const db = require("../database");


const obtenerPacientes = (req, res) => {
  let pagina = Number(req.query.pagina || 1);
  let tam = Number(req.query.tam || 10);
  if (pagina < 1) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "pagina debe ser 1 o mas" });
  }
  if (tam < 1 || tam > 50) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "tamaño debe ser entre 1 y 50" });
  }
  let saltar = (pagina - 1) * tam;
  db.query("SELECT COUNT(*) AS total FROM pacientes", (error, total) => {
    if (error) {
      return res.status(500).json({ codigo: "erro interno", mensaje: "Error en el servidor" });
    }
    db.query("SELECT * FROM pacientes ORDER BY id LIMIT ? OFFSET ?", [tam, saltar], (error, datos) => {
      if (error) {
        return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
      }
      res.json({pagina: pagina, tam: tam, total: total[0].total, datos: datos });
    });
  });
};


const obtenerPaciente = (req, res) => {
  let id = Number(req.params.id);
  if (!id || id < 1) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "id debe ser numero mayor a 0" });
  }
  db.query("SELECT * FROM pacientes WHERE id = ?", [id], (error, filas) => {
    if (error) {
      return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
    }
    if (filas.length === 0) {
      return res.status(404).json({ codigo: "no encontrado", mensaje: "Paciente con id " + id + " no existe" });
    }
    res.json(filas[0]);
  });
};


const crearPaciente = (req, res) => {
  let b = req.body;
  if (!b.ci || !b.nombre || !b.apellido || !b.fecha_nacimiento || !b.seguro) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "Faltan datos" });
  }
  if (b.seguro !== "SI" && b.seguro !== "NO") {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "seguro solo puede ser SI o NO" });
  }
  db.query(
    "INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES (?, ?, ?, ?, ?, ?)",
    [b.ci, b.nombre, b.apellido, b.fecha_nacimiento, b.telefono || null, b.seguro],
    (error, r) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ codigo: "duplcado ", mensaje: "El CI ya esta registrado" });
        }
        return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
      }
      db.query("SELECT * FROM pacientes WHERE id = ?", [r.insertId], (error, filas) => {
        if (error) {
          return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
        }
        res.location("/api/v1/pacientes/" + r.insertId);
        res.status(201).json(filas[0]);
      });
    }
  );
};

const editarPaciente = (req, res) => {
  let id = Number(req.params.id);
  if (!id || id < 1) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "id debe ser numero mayor a 0" });
  }
  let b = req.body;
  if (!b.ci || !b.nombre || !b.apellido || !b.fecha_nacimiento || !b.seguro) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "Faltan datos para actualizar" });
  }
  if (b.seguro !== "SI" && b.seguro !== "NO") {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "seguro solo puede ser SI o NO" });
  }
  db.query("SELECT id FROM pacientes WHERE id = ?", [id], (error, existe) => {
    if (error) {
      return res.status(500).json({ codigo: "error intenrno", mensaje: "Error en el servidor" });
    }
    if (existe.length === 0) {
      return res.status(404).json({ codigo: "no encontrado", mensaje: "Paciente con id " + id + " no existe" });
    }
    db.query(
      "UPDATE pacientes SET ci=?, nombre=?, apellido=?, fecha_nacimiento=?, telefono=?, seguro=? WHERE id=?",
      [b.ci, b.nombre, b.apellido, b.fecha_nacimiento, b.telefono || null, b.seguro, id],
      (error) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ codigo: "duplicaod", mensaje: "El CI ya existe en otro paciente" });
          }
          return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
        }
        db.query("SELECT * FROM pacientes WHERE id = ?", [id], (error, filas) => {
          if (error) {
            return res.status(500).json({ codigo: "error interno ", mensaje: "Error en el servidor" });
          }
          res.json(filas[0]);
        });
      }
    );
  });
};

const parchePaciente = (req, res) => {
  let id = Number(req.params.id);
  if (!id || id < 1) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "id debe ser numero mayor a 0" });
  }
  let b = req.body;
  let campos = [];
  let valores = [];
  if (b.ci) { campos.push("ci = ?"); valores.push(b.ci); }
  if (b.nombre) { campos.push("nombre = ?"); valores.push(b.nombre); }
  if (b.apellido) { campos.push("apellido = ?"); valores.push(b.apellido); }
  if (b.fecha_nacimiento) { campos.push("fecha_nacimiento = ?"); valores.push(b.fecha_nacimiento); }
  if (b.telefono !== undefined) { campos.push("telefono = ?"); valores.push(b.telefono); }
  if (b.seguro) {
    if (b.seguro !== "SI" && b.seguro !== "NO") {
      return res.status(422).json({ codigo: "DATOS_INVALIDOS", mensaje: "seguro solo puede ser SI o NO" });
    }
    campos.push("seguro = ?"); valores.push(b.seguro);
  }
  if (campos.length === 0) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "Manda al menos un campo" });
  }
  db.query("SELECT id FROM pacientes WHERE id = ?", [id], (error, existe) => {
    if (error) {
      return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
    }
    if (existe.length === 0) {
      return res.status(404).json({ codigo: "no encontrado", mensaje: "Paciente con id " + id + " no existe" });
    }
    valores.push(id);
    db.query("UPDATE pacientes SET " + campos.join(", ") + " WHERE id = ?", valores, (error) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ codigo: "duplicado", mensaje: "El CI ya existe en otro paciente" });
        }
        return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
      }
      db.query("SELECT * FROM pacientes WHERE id = ?", [id], (error, filas) => {
        if (error) {
          return res.status(500).json({ codigo: "error interno ", mensaje: "Error en el servidor" });
        }
        res.json(filas[0]);
      });
    });
  });
};


const eliminarPaciente = (req, res) => {
  let id = Number(req.params.id);
  if (!id || id < 1) {
    return res.status(422).json({ codigo: "datos invalidos", mensaje: "id debe ser numero mayor a 0" });
  }
  db.query("DELETE FROM pacientes WHERE id = ?", [id], (error, r) => {
    if (error) {
      return res.status(500).json({ codigo: "error interno", mensaje: "Error en el servidor" });
    }
    if (r.affectedRows === 0) {
      return res.status(404).json({ codigo: "no encontrado ", mensaje: "Paciente con id " + id + " no existe" });
    }
    res.status(204).send();
  });
};

module.exports = {
  obtenerPacientes,
  obtenerPaciente,
  crearPaciente,
  editarPaciente,
  parchePaciente,
  eliminarPaciente
};
