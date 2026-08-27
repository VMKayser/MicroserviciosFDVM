const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tareasdb';

const Tarea = mongoose.model('Tarea', new mongoose.Schema({
  titulo: { type: String, required: true },
  completada: { type: Boolean, default: false }
}, { timestamps: true }));

// Health check: lo usa Docker para saber si el servicio está sano
app.get('/salud', (req, res) => res.json({
  estado: 'ok',
  db: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada'
}));

app.get('/tareas', async (req, res) => res.json(await Tarea.find()));

app.post('/tareas', async (req, res) => {
  try {
    const tarea = await Tarea.create(req.body);
    res.status(201).json(tarea);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/tareas/:id', async (req, res) => {
  const t = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!t) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(t);
});

app.delete('/tareas/:id', async (req, res) => {
  const t = await Tarea.findByIdAndDelete(req.params.id);
  if (!t) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.status(204).send();
});

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  });
