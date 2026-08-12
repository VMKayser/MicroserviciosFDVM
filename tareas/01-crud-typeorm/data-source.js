require('reflect-metadata');
const { DataSource } = require('typeorm');

const Candidato = require('./entidades/Candidato');
const Cargo = require('./entidades/Cargo');
const Lugar = require('./entidades/Lugar');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'candidatos.sqlite',
  synchronize: true,
  logging: false,
  entities: [Candidato, Cargo, Lugar]
});

module.exports = { AppDataSource };
