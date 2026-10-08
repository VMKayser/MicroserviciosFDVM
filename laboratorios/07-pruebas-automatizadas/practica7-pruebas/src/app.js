const express = require("express");
const { estadoDeTarea } = require("./tarea");
const app = express();
app.use(express.json());
const tareas = [];

app.post("/tareas", (req, res) => {
  if (!req.body.titulo) return res.status(400).json({ error: "titulo es obligatorio" });
  const tarea = { id: tareas.length + 1, ...req.body, completada: false };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

app.get("/tareas", (_req, res) => res.json(
  tareas.map(t => ({ ...t, estado: estadoDeTarea(t) }))
));

module.exports = app;
