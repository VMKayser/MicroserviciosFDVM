const grpc = require("@grpc/grpc-js");
const db = require("../database");
function aHorario(f) {
  let d = new Date(f.fecha);
  let fecha = d.toISOString().slice(0, 10);
  let hora = String(f.hora).slice(0, 5);
  return { id: f.id, medico_id: f.medico_id, fecha: fecha, hora: hora, disponible: f.disponible };
}

const obtenerMedico = (call, callback) => {
  let id = Number(call.request.id);
  db.query("SELECT * FROM medicos WHERE id = $1", [id], (error, r) => {
    if (error) {
      console.log("Error al ejecutar la consulta");
      return callback({ code: grpc.status.INTERNAL, message: "Error en el servidor" });
    }
    if (r.rows.length === 0) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Medico con id " + id + " no existe" });
    }
    callback(null, r.rows[0]);
  });
};

const listarMedicos = (call, callback) => {
  db.query("SELECT * FROM medicos ORDER BY id", (error, r) => {
    if (error) {
      console.log("Error al ejecutar la consulta");
      return callback({ code: grpc.status.INTERNAL, message: "Error en el servidor" });
    }
    callback(null, { medicos: r.rows });
  });
};

const listarHorariosDisponibles = (call) => {
  let id = Number(call.request.id);
  db.query("SELECT id FROM medicos WHERE id = $1", [id], (error, m) => {
    if (error) {
      console.log("Error al ejecutar la consulta");
      call.emit("error", { code: grpc.status.INTERNAL, message: "Error en el servidor" });
      call.end();
      return;
    }
    if (m.rows.length === 0) {
      call.emit("error", { code: grpc.status.NOT_FOUND, message: "Medico con id " + id + " no existe" });
      call.end();
      return;
    }
    db.query("SELECT * FROM horarios WHERE medico_id = $1 AND disponible = 'SI' ORDER BY fecha, hora", [id], (error, r) => {
      if (error) {
        console.log("Error al ejecutar la consulta");
        call.emit("error", { code: grpc.status.INTERNAL, message: "Error en el servidor" });
        call.end();
        return;
      }
      for (let i = 0; i < r.rows.length; i++) {
        call.write(aHorario(r.rows[i]));
      }
      call.end();
    });
  });
};

const reservarHorario = (call, callback) => {
  let id = Number(call.request.id);
  db.query("UPDATE horarios SET disponible = 'NO' WHERE id = $1 AND disponible = 'SI' RETURNING *", [id], (error, r) => {
    if (error) {
      console.log("Error al ejecutar la consulta");
      return callback({ code: grpc.status.INTERNAL, message: "Error en el servidor" });
    }
    if (r.rows.length === 1) {
      return callback(null, aHorario(r.rows[0]));
    }
    db.query("SELECT id FROM horarios WHERE id = $1", [id], (error, e) => {
      if (error) {
        console.log("Error al ejecutar la consulta");
        return callback({ code: grpc.status.INTERNAL, message: "Error en el servidor" });
      }
      if (e.rows.length === 0) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Horario con id " + id + " no existe" });
      }
      callback({ code: grpc.status.FAILED_PRECONDITION, message: "Horario " + id + " ya esta ocupado" });
    });
  });
};

module.exports = {
  obtenerMedico,
  listarMedicos,
  listarHorariosDisponibles,
  reservarHorario
};
