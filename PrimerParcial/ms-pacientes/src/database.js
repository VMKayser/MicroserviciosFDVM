const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'db-pacientes',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'pacientes_user',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'root123',
  database: process.env.DB_NAME || 'clinica'
});


connection.connect((error) => {
  if (error) {
    console.log("Error al conectar a la base de datos");
    return;
  }
  console.log("Conectado a la base de datos");
});

module.exports = connection;
