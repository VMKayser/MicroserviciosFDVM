const mongoose = require('mongoose');

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/trabajadores_db');
        console.log('Conexión a MongoDB establecida correctamente.');
      } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
      }
    };

    module.exports = connectDB;