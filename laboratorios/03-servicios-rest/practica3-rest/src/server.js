require("dotenv").config();
const app = require('./app');
const { conectar } = require('./repositorio');

const PORT = process.env.PORT || 3000;

conectar()
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
