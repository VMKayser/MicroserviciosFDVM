require("dotenv").config();
const app = require('./app');
const { conectar } = require('./repositorio');

const PORT = process.env.PORT || 3000;

conectar()
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor REST corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.warn("Aviso: MongoDB no disponible (" + err.message + ").");
    console.log(`Servidor REST corriendo en http://localhost:${PORT} (modo compatible Práctica 4)`);
    app.listen(PORT);
  });
