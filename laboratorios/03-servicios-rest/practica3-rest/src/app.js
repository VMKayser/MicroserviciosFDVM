const express = require('express');
const swaggerUi = require('swagger-ui-express');
const doc = require('yamljs').load('./openapi.yaml');
const { fallo } = require('./errores');
const { router } = require('./usuarios.rutas');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));

app.get('/salud', (_req, res) => res.json({ estado: 'arriba' }));

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
