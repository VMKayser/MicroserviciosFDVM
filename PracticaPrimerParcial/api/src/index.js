require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const app = require('./app');
const connectDB = require('./database');
const typeDefs = require('./graphql/esquema');
const resolvers = require('./graphql/resolver');

const PORT = process.env.PORT || 3000;

// Configuración de Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

async function iniciarServidor() {
  try {
    // 1. Conectar a MongoDB
    await connectDB();

    // 2. Iniciar Apollo Server
    await apolloServer.start();

    // 3. Endpoint POST para consultas y mutaciones de GraphQL
    app.post('/graphql', async (req, res) => {
      try {
        const { query, variables, operationName } = req.body;
        const respuesta = await apolloServer.executeOperation({
          query,
          variables,
          operationName,
        });

        if (respuesta.body.kind === 'single') {
          return res.status(respuesta.http?.status || 200).json(respuesta.body.singleResult);
        }
        res.status(500).json({ error: 'Error procesando solicitud GraphQL' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 4. Endpoint GET para /graphql (información de bienvenida)
    app.get('/graphql', (req, res) => {
      res.json({
        mensaje: 'Servidor GraphQL activo. Envía peticiones POST con { query, variables } a este endpoint.',
        ejemplo_query: '{ obtenerTrabajadores { id nombre cargo departamento } }',
      });
    });

    // 5. Levantar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 Servidor activo en: http://localhost:${PORT}`);
      console.log(`📋 API REST:     http://localhost:${PORT}/trabajador`);
      console.log(`🔮 GraphQL API:  http://localhost:${PORT}/graphql`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();
