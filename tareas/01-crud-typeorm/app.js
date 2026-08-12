const express = require('express');
const path = require('path');
const { AppDataSource } = require('./data-source');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'vistas'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const candidatos = () => AppDataSource.getRepository('Candidato');
const cargos = () => AppDataSource.getRepository('Cargo');
const lugares = () => AppDataSource.getRepository('Lugar');

app.get('/', async (req, res) => {
  const lista = await candidatos().find({ relations: ['cargo', 'lugar'] });
  res.render('lista', { candidatos: lista });
});

app.get('/nuevo', async (req, res) => {
  res.render('formulario', {
    titulo: 'Nuevo candidato',
    accion: '/nuevo',
    candidato: null,
    cargos: await cargos().find(),
    lugares: await lugares().find(),
    error: null
  });
});

app.post('/nuevo', async (req, res) => {
  const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;

  const existe = await candidatos().findOneBy({ ci });
  if (existe) {
    return res.render('formulario', {
      titulo: 'Nuevo candidato',
      accion: '/nuevo',
      candidato: req.body,
      cargos: await cargos().find(),
      lugares: await lugares().find(),
      error: 'Ya existe un candidato con ese CI.'
    });
  }

  await candidatos().save({
    ci,
    nombres,
    apellido1,
    apellido2,
    cargo_id: Number(cargo_id),
    lugar_id: Number(lugar_id)
  });
  res.redirect('/');
});

app.get('/editar/:ci', async (req, res) => {
  const candidato = await candidatos().findOneBy({ ci: req.params.ci });
  if (!candidato) return res.redirect('/');

  res.render('formulario', {
    titulo: 'Editar candidato',
    accion: '/editar/' + candidato.ci,
    candidato,
    cargos: await cargos().find(),
    lugares: await lugares().find(),
    error: null
  });
});

app.post('/editar/:ci', async (req, res) => {
  const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;

  await candidatos().update(
    { ci: req.params.ci },
    {
      nombres,
      apellido1,
      apellido2,
      cargo_id: Number(cargo_id),
      lugar_id: Number(lugar_id)
    }
  );
  res.redirect('/');
});

app.post('/eliminar/:ci', async (req, res) => {
  await candidatos().delete({ ci: req.params.ci });
  res.redirect('/');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => console.error('Error al conectar la base de datos:', error));
