const { Router } = require("express");
const { fallo } = require("./errores");
const { validarUsuario } = require("./usuarios.validacion");
const repo = require("./repositorio");

const router = Router();
const TOPE = 100;

router.get("/", async (req, res) => {
  const pagina = Math.max(1, Number(req.query.pagina) || 1);
  const limite = Math.min(TOPE, Number(req.query.limite) || 20);
  const filtro = {};
  if (req.query.edadMin) filtro.edad = { $gte: Number(req.query.edadMin) };
  const orden = { [req.query.ordenPor || "nombre"]: req.query.orden === "desc" ? -1 : 1 };
  const { datos, total } = await repo.listar(filtro, orden, pagina, limite);
  res.json({
    datos,
    paginacion: {
      pagina,
      limite,
      total,
      paginas: Math.ceil(total / limite),
    },
  });
});

router.post("/", async (req, res) => {
  const d = validarUsuario(req.body);
  if (d.length) {
    return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", d);
  }

  const { nombre, correo, edad } = req.body;
  const repetido = await repo.porCorreo(correo);
  if (repetido) {
    return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
  }

  const resultado = await repo.crear({ nombre, correo, edad });
  const usuario = { _id: resultado.insertedId, nombre, correo, edad };
  res.status(201)
    .location(`/usuarios/${usuario._id}`)
    .json(usuario);
});

router.get("/:id", async (req, res) => {
  const usuario = await repo.obtener(req.params.id);
  if (!usuario) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  res.json(usuario);
});

router.delete("/:id", async (req, res) => {
  const resultado = await repo.borrar(req.params.id);
  if (!resultado || resultado.deletedCount === 0) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  res.status(204).end();
});

module.exports = { router };
