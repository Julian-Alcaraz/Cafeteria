import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Soporte para __dirname en módulos ES (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://admin:adminpassword@localhost:5432/cafeteria_dev?schema=public',
  entities: [join(__dirname, '..').replace(/\\/g, '/') + '/**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '..').replace(/\\/g, '/') + '/migrations/*{.ts,.js}'],
  synchronize: false, // Las migraciones manejarán la BD
  logging: true,
});
