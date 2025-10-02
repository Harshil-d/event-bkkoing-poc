import { DataSource } from 'typeorm';

const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/**/*.ts'],
  synchronize: true,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});

module.exports = { connectionSource };
