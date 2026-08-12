const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cargo',
  tableName: 'cargos',
  columns: {
    id: { type: 'int', primary: true, generated: true },
    nombre: { type: 'varchar', length: 60 }
  }
});
