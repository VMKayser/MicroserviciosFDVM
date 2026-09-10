const express = require('express');
const swaggerUi = require('swagger-ui-express');
const doc = require('yamljs').load('./openapi.yaml');
const { fallo } = require('./errores');
const { router } = require('./usuarios.rutas');
const { obtenerEstudiante } = require('./estudiantes.cliente');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));

app.get('/salud', (_req, res) => res.json({ estado: 'arriba' }));

// ── Compatibilidad con Práctica 4 y Práctica 5 ──────────────
const usuariosBFF = [
  { id: 1, nombre: 'Ana López', email: 'ana@correo.com' },
  { id: 2, nombre: 'Carlos Ruiz', email: 'carlos@correo.com' },
  { id: 3, nombre: 'María García', email: 'maria@correo.com' }
];

app.get('/usuarios', (_req, res) => {
  res.json(usuariosBFF);
});

app.get('/usuarios/:id', (req, res) => {
  const usuario = usuariosBFF.find((u) => u.id === Number(req.params.id));
  if (!usuario) {
    return fallo(res, 404, 'NO_ENCONTRADO', 'Usuario no encontrado');
  }
  res.json(usuario);
});

// Endpoint que consume el servicio gRPC interno
app.get('/usuarios/:id/expediente', async (req, res) => {
  const ci = req.params.id === '1' ? '9876543' : req.params.id;
  try {
    const estudiante = await obtenerEstudiante(ci);
    res.json(estudiante);
  } catch (err) {
    if (err.code === 5) {
      return res.status(404).json({ error: 'Estudiante no encontrado en gRPC' });
    }
    if (err.code === 14) {
      return res.status(503).json({ error: 'Servicio gRPC interno no disponible' });
    }
    res.status(500).json({ error: err.details || err.message });
  }
});

// Endpoints REST de ventas y detalle para mediciones de Laboratorio 7
app.get('/ventas/:id', (req, res) => {
  res.json({ id: Number(req.params.id), cliente_id: 1, fecha: "2026-08-03", total: 450.00 });
});

app.get('/ventas/:id/detalle', (req, res) => {
  res.json([
    { id: 1, venta_id: Number(req.params.id), producto: "Laptop", cantidad: 1, precio_unitario: 350.00 },
    { id: 2, venta_id: Number(req.params.id), producto: "Mouse", cantidad: 2, precio_unitario: 50.00 }
  ]);
});

app.use('/v1/usuarios', router);

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return fallo(res, 400, 'JSON_INVALIDO', 'El cuerpo de la solicitud no es un JSON válido');
  }
  next(err);
});

app.use((_req, res) => {
  fallo(res, 404, 'NO_ENCONTRADO', 'Ruta no encontrada');
});

module.exports = app;
