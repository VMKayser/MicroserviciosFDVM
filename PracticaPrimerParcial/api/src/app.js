const express = require('express');
const cors = require('cors');
const trabajadorRoutes = require('./routes/trabajadorRoutes');

    

const app = express();

    // Middlewares
    
app.use(cors());
app.use(express.json());

    // Ruta de estado
app.get('/salud', (req, res) => {
    res.json({ estado: 'ok', mensaje: 'Servicio API REST activo' });
});

    // Rutas REST
app.use('/trabajador', trabajadorRoutes);

module.exports = app;