const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Candidato',
  tableName: 'candidatos',
  columns: {
    ci: { type: 'varchar', length: 12, primary: true },
    nombres: { type: 'varchar', length: 60 },
    apellido1: { type: 'varchar', length: 30 },
    apellido2: { type: 'varchar', length: 40, nullable: true },
    cargo_id: { type: 'int' },
    lugar_id: { type: 'int' }
  },
  relations: {
    cargo: {
      type: 'many-to-one',
      target: 'Cargo',
      joinColumn: { name: 'cargo_id' }
    },
    lugar: {
      type: 'many-to-one',
      target: 'Lugar',
      joinColumn: { name: 'lugar_id' }
    }
  }
});
