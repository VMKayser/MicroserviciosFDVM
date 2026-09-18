const Trabajador = require('../models/Trabajador');

const resolvers = {
Query: {

    obtenerTrabajadores: async () => {
          return await Trabajador.find();
        },

        obtenerTrabajador: async (_parent, { id }) => {
          return await Trabajador.findById(id);
        },
      },

      Mutation: {
        crearTrabajador: async (_parent, { input }) => {
          return await Trabajador.create(input);
        },
        actualizarTrabajador: async (_parent, { id, input }) => {
          return await Trabajador.findByIdAndUpdate(id, input, { new: true });
        },
        eliminarTrabajador: async (_parent, { id }) => {
          const eliminado = await Trabajador.findByIdAndDelete(id);
          return !!eliminado;
        },
      },
    };





module.exports = resolvers;