require("dotenv").config();
const express = require("express");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/pacientes", pacienteRoutes);

app.get("/api/v1/salud", (req, res) => res.json({ ok: true }));

app.use("/", (req, res) => {
  res.send("Microservicio pacientes");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
