import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config.js';

export const runSeed = async () => {
  const dataSource: DataSource = await AppDataSource.initialize();
  
  console.log('Running seeds...');
  // Aquí puedes agregar la lógica de población de datos inicial.
  // Ej: await dataSource.query(`INSERT INTO ...`)
  
  console.log('Seeds executed successfully.');
  await dataSource.destroy();
};

runSeed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
