const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const depthLimit = require('graphql-depth-limit');
const typeDefs = require('./esquema');
const resolvers = require('./resolvers');
const { crearCargadores } = require('./cargadores');

const enProduccion = process.env.NODE_ENV === 'production';
const limiteProfundidad = Number(process.env.DEPTH_LIMIT) || 6;

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: !enProduccion,
    validationRules: [depthLimit(limiteProfundidad)],
    formatError: (err) => {
      console.error('[GraphQL]', err);
      return {
        message: err.message,
        code: err.extensions && err.extensions.code,
        path: err.path,
      };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({ cargadores: crearCargadores() }),
  });

  console.log('GraphQL escuchando en ' + url);
}

main();
