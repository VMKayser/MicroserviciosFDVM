const { Client } = require("pg");
const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME
});
db.connect((error) => {
  if (error) {
    console.log("Error al conectar a la base de datos");
    return;
  }
  console.log("Conectado a la base de datos");
});

module.exports = db;
