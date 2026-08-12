const { AppDataSource } = require('./data-source');

async function main() {
  await AppDataSource.initialize();

  const cargos = AppDataSource.getRepository('Cargo');
  const lugares = AppDataSource.getRepository('Lugar');

  if ((await cargos.count()) === 0) {
    await cargos.save([
      { nombre: 'Presidente' },
      { nombre: 'Vicepresidente' },
      { nombre: 'Senador' },
      { nombre: 'Diputado' }
    ]);
  }

  if ((await lugares.count()) === 0) {
    await lugares.save([
      { nombre: 'La Paz' },
      { nombre: 'Cochabamba' },
      { nombre: 'Santa Cruz' },
      { nombre: 'Oruro' }
    ]);
  }

  console.log('Datos iniciales cargados.');
  await AppDataSource.destroy();
}

main();
